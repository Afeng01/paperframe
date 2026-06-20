#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MODE="${1:-dev}"
HOST="${HOST:-127.0.0.1}"
PORT="${PORT:-4321}"

if [[ "$MODE" != "dev" && "$MODE" != "start" ]]; then
  echo "Unsupported mode: $MODE" >&2
  exit 1
fi

find_repo_processes() {
  local candidates
  candidates="$(pgrep -f 'next-server|next dev|next start|npm run dev|npm run start' || true)"

  for pid in $candidates; do
    local cwd
    cwd="$(lsof -a -p "$pid" -d cwd -Fn 2>/dev/null | sed -n 's/^n//p' | head -n 1)"

    if [[ "$cwd" == "$ROOT_DIR" ]]; then
      echo "$pid"
    fi
  done | awk '!seen[$0]++'
}

read_lines_into_array() {
  local __var_name="$1"
  local __value
  local -a __items=()

  while IFS= read -r __value; do
    if [[ -n "$__value" ]]; then
      __items+=("$__value")
    fi
  done

  eval "$__var_name=()"

  if [[ "${#__items[@]}" -gt 0 ]]; then
    eval "$__var_name=(\"\${__items[@]}\")"
  fi
}

stop_repo_processes() {
  local -a repo_pids=()
  read_lines_into_array repo_pids < <(find_repo_processes)

  if [[ "${#repo_pids[@]}" -eq 0 ]]; then
    return
  fi

  echo "Stopping existing Paperframe processes: ${repo_pids[*]}"
  kill "${repo_pids[@]}" 2>/dev/null || true

  local attempts=20
  while (( attempts > 0 )); do
    repo_pids=()
    read_lines_into_array repo_pids < <(find_repo_processes)

    if [[ "${#repo_pids[@]}" -eq 0 ]]; then
      return
    fi

    sleep 0.2
    ((attempts--))
  done

  echo "Force stopping stubborn Paperframe processes: ${repo_pids[*]}"
  kill -9 "${repo_pids[@]}" 2>/dev/null || true
}

assert_port_available() {
  local -a port_pids=()
  read_lines_into_array port_pids < <(lsof -tiTCP:"$PORT" -sTCP:LISTEN 2>/dev/null || true)

  if [[ "${#port_pids[@]}" -eq 0 ]]; then
    return
  fi

  for pid in "${port_pids[@]}"; do
    local cwd
    cwd="$(lsof -a -p "$pid" -d cwd -Fn 2>/dev/null | sed -n 's/^n//p' | head -n 1)"

    if [[ "$cwd" == "$ROOT_DIR" ]]; then
      continue
    fi

    echo "Port $PORT is already used by another process (pid $pid, cwd: ${cwd:-unknown})." >&2
    echo "Free that port or rerun with a different PORT value." >&2
    exit 1
  done
}

stop_repo_processes
assert_port_available

if [[ "$MODE" == "dev" ]]; then
  exec ./node_modules/.bin/next dev --webpack --hostname "$HOST" --port "$PORT"
fi

exec ./node_modules/.bin/next start --hostname "$HOST" --port "$PORT"
