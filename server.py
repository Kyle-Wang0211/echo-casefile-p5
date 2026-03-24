#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import urllib.error
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


ROOT = Path(__file__).resolve().parent
PROMPT_PATH = ROOT / "prompts" / "echo_system_prompt.txt"
DEFAULT_MODEL = "gpt-5-mini"
OPENAI_URL = "https://api.openai.com/v1/responses"
ALLOWED_ORIGIN = os.getenv("ALLOWED_ORIGIN", "*")


def load_prompt() -> str:
    return PROMPT_PATH.read_text(encoding="utf-8").strip()


def build_state_message(story_state: dict) -> str:
    evidence_lines = []
    for item in story_state.get("available_evidence", []):
        title = item.get("title", "Unknown evidence")
        description = item.get("description", "")
        evidence_lines.append(f"- {title}: {description}")

    evidence_block = "\n".join(evidence_lines) if evidence_lines else "- None unlocked"

    return (
        "Current story state for this turn:\n"
        f"Scene: {story_state.get('stage', 'Unknown stage')}\n"
        f"Scene summary: {story_state.get('scene_summary', '')}\n"
        f"Latest reveal: {story_state.get('last_reveal', '')}\n"
        f"Interaction goal: {story_state.get('interaction_goal', '')}\n"
        "Available evidence:\n"
        f"{evidence_block}\n"
        "Use this as ground truth for the next reply."
    )


def extract_output_text(payload: dict) -> str:
    chunks: list[str] = []

    for item in payload.get("output", []):
      if item.get("type") != "message":
        continue
      for content in item.get("content", []):
        if content.get("type") in {"output_text", "text"}:
          text = content.get("text", "")
          if text:
            chunks.append(text)

    return "\n".join(chunks).strip()


class AppHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def _send_json(self, status: int, payload: dict) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_cors_headers(self) -> None:
        self.send_header("Access-Control-Allow-Origin", ALLOWED_ORIGIN)
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def end_headers(self) -> None:
        if self.path.startswith("/api/"):
            self._send_cors_headers()
        super().end_headers()

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self) -> None:
        if self.path == "/api/health":
            self._send_json(
                200,
                {
                    "ok": True,
                    "configured": bool(os.getenv("OPENAI_API_KEY")),
                    "model": os.getenv("OPENAI_MODEL", DEFAULT_MODEL),
                },
            )
            return

        super().do_GET()

    def do_POST(self) -> None:
        if self.path != "/api/chat":
            self._send_json(404, {"error": "Not found"})
            return

        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            self._send_json(
                400,
                {
                    "error": "OPENAI_API_KEY is not set on the local server.",
                },
            )
            return

        try:
            content_length = int(self.headers.get("Content-Length", "0"))
            raw_body = self.rfile.read(content_length)
            payload = json.loads(raw_body.decode("utf-8"))
        except (ValueError, json.JSONDecodeError):
            self._send_json(400, {"error": "Invalid JSON request body."})
            return

        story_state = payload.get("story_state", {})
        messages = payload.get("messages", [])

        input_items = [
            {
                "role": "developer",
                "content": build_state_message(story_state),
            }
        ]

        for message in messages:
            role = message.get("role")
            content = message.get("content", "")
            if role not in {"user", "assistant"} or not isinstance(content, str):
                continue
            input_items.append({"role": role, "content": content})

        request_payload = {
            "model": os.getenv("OPENAI_MODEL", DEFAULT_MODEL),
            "instructions": load_prompt(),
            "input": input_items,
            "reasoning": {"effort": "minimal"},
            "max_output_tokens": 180,
            "store": False,
        }

        request_data = json.dumps(request_payload).encode("utf-8")
        request = urllib.request.Request(
            OPENAI_URL,
            data=request_data,
            method="POST",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
        )

        try:
            with urllib.request.urlopen(request, timeout=60) as response:
                response_payload = json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as exc:
            details = exc.read().decode("utf-8", errors="replace")
            self._send_json(
                exc.code,
                {
                    "error": f"OpenAI API error: {details}",
                },
            )
            return
        except urllib.error.URLError as exc:
            self._send_json(
                502,
                {
                    "error": f"Network error while calling OpenAI: {exc.reason}",
                },
            )
            return

        text = extract_output_text(response_payload)
        if not text:
            self._send_json(
                502,
                {
                    "error": "OpenAI returned a response, but no text output was found.",
                },
            )
            return

        self._send_json(
            200,
            {
                "ok": True,
                "text": text,
                "model": request_payload["model"],
            },
        )


def main() -> None:
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    server = ThreadingHTTPServer((host, port), AppHandler)
    print(f"Serving ECHO Casefile at http://{host}:{port}")
    server.serve_forever()


if __name__ == "__main__":
    main()
