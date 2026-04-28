#!/usr/bin/env bash
set -euo pipefail

BOOTSTRAP_MARKER="/etc/devops-onpremise-bootstrap.done"

if [[ -f "$BOOTSTRAP_MARKER" ]]; then
	echo "=== VM already provisioned. Skipping bootstrap ==="
	exit 0
fi

echo "=== Update system packages ==="
apt-get update -y
apt-get upgrade -y

echo "=== Disable swap (required for Kubernetes) ==="
swapoff -a
sed -i '/swap/d' /etc/fstab

echo "=== Install common tools ==="
apt-get install -y curl wget vim net-tools

touch "$BOOTSTRAP_MARKER"
echo "=== Bootstrap completed ==="
