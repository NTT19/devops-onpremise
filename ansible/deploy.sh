#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ -f "$SCRIPT_DIR/site.yml" && -d "$SCRIPT_DIR/inventory" ]]; then
  ANSIBLE_DIR="$SCRIPT_DIR"
else
  ANSIBLE_DIR="$SCRIPT_DIR/ansible"
fi

INVENTORY="$ANSIBLE_DIR/inventory/production/hosts.yml"
PLAYBOOK="$ANSIBLE_DIR/site.yml"
VAULT_FILE="$ANSIBLE_DIR/vault/sqlserver-secrets.yml"

ASK_BECOME=0

usage() {
  cat <<'EOF'
Usage: ./deploy.sh [options]

Options:
  --ask-become-pass   Prompt for sudo password
  --help              Show this help

Env:
  VAULT_PASS_FILE     Path to ansible vault password file
EOF
}

for arg in "$@"; do
  case "$arg" in
    --ask-become-pass) ASK_BECOME=1 ;;
    --help) usage; exit 0 ;;
    *)
      echo "Unknown option: $arg"
      usage
      exit 1
      ;;
  esac
done

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing command: $1"
    exit 1
  fi
}

require_cmd ansible-playbook

if [[ ! -f "$PLAYBOOK" ]]; then
  echo "Playbook not found: $PLAYBOOK"
  exit 1
fi

if [[ ! -f "$INVENTORY" ]]; then
  echo "Inventory not found: $INVENTORY"
  exit 1
fi

if [[ ! -f "$VAULT_FILE" ]]; then
  echo "Vault file not found: $VAULT_FILE"
  echo "SQL Server playbooks require this file."
  exit 1
fi

if ! head -n 1 "$VAULT_FILE" | grep -q '^\$ANSIBLE_VAULT;'; then
  echo "Vault file is not encrypted. Run: ansible-vault encrypt $VAULT_FILE"
  exit 1
fi

VAULT_OPT=()
if [[ -n "${VAULT_PASS_FILE:-}" ]]; then
  VAULT_OPT=(--vault-password-file "$VAULT_PASS_FILE")
else
  VAULT_OPT=(--ask-vault-pass)
fi

BECOME_OPT=()
if [[ "$ASK_BECOME" -eq 1 ]]; then
  BECOME_OPT=(--ask-become-pass)
fi

echo "Running Ansible playbook: $PLAYBOOK"
ansible-playbook -i "$INVENTORY" "$PLAYBOOK" "${BECOME_OPT[@]}" "${VAULT_OPT[@]}"

echo "Deploy completed."