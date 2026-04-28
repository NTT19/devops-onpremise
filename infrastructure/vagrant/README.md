# DevOps On-Premise Infrastructure (Vagrant)

This directory contains the local/on-prem infrastructure using Vagrant + VirtualBox to support Kubernetes, Jenkins, and SQL Server on the same VM cluster.

## System Requirements

- Vagrant >= 2.2.0
- VirtualBox >= 6.1
- Minimum 8GB RAM (16GB recommended)
- At least 50GB free disk space

## Standardized Structure

```
infrastructure/vagrant/
|-- Vagrantfile             # Entry point that loads config and creates VMs
|-- config/
|   `-- cluster.yml         # Centralized config for box, network, CPU, RAM, and nodes
|   `-- values.env          # Centralized variable values loaded by Vagrantfile
|-- scripts/
|   `-- bootstrap.sh        # Shared provisioning for all nodes
|-- README.md
`-- .vagrant/               # Local metadata (auto-generated, do not commit)
```

## Default Topology

- Box: `ubuntu/focal64`
- Network prefix: `192.168.56`
- Nodes:
  - `master` - `192.168.56.10` - 2 CPU - 6144 MB RAM
  - `worker1` - `192.168.56.11` - 1 CPU - 2048 MB RAM
  - `worker2` - `192.168.56.12` - 1 CPU - 2048 MB RAM
  - `server` - `192.168.56.13` - 1 CPU - 2048 MB RAM

Node names and IP addresses are kept unchanged for compatibility with the current Ansible inventory.

## Usage

```bash
cd infrastructure/vagrant

# Create and start all virtual machines
vagrant up

# Start specific nodes
vagrant up master
vagrant up worker1
vagrant up worker2
vagrant up server

# SSH
vagrant ssh master
vagrant ssh worker1
vagrant ssh worker2
vagrant ssh server
```

## Configuration Customization

The file `config/cluster.yml` uses variables (ERB syntax), and values are loaded automatically from `config/values.env`.

Edit `config/values.env` to customize your environment.

Required keys in `config/values.env`:

- `VAGRANT_BOX`
- `VAGRANT_NETWORK_PREFIX`
- `MASTER_IP_LAST_OCTET`
- `MASTER_CPUS`
- `MASTER_MEMORY`
- `WORKER1_IP_LAST_OCTET`
- `WORKER1_CPUS`
- `WORKER1_MEMORY`
- `WORKER2_IP_LAST_OCTET`
- `WORKER2_CPUS`
- `WORKER2_MEMORY`
- `SERVER_IP_LAST_OCTET`
- `SERVER_CPUS`
- `SERVER_MEMORY`

Example `config/values.env`:

```env
VAGRANT_BOX=ubuntu/focal64
VAGRANT_NETWORK_PREFIX=192.168.56

MASTER_IP_LAST_OCTET=10
MASTER_CPUS=2
MASTER_MEMORY=6144

WORKER1_IP_LAST_OCTET=11
WORKER1_CPUS=1
WORKER1_MEMORY=2048

WORKER2_IP_LAST_OCTET=12
WORKER2_CPUS=1
WORKER2_MEMORY=2048

SERVER_IP_LAST_OCTET=13
SERVER_CPUS=1
SERVER_MEMORY=2048
```

Then run:

```bash
vagrant up
```

To change topology, update `config/values.env` instead of hardcoded values.

You can still adjust `config/cluster.yml` to:

- Change the Ubuntu box
- Increase/decrease CPU and RAM per node
- Add new nodes by appending objects in `nodes`

After updating the config:

```bash
vagrant reload --provision
```

## Useful Commands

```bash
vagrant status
vagrant halt <node>
vagrant destroy -f
vagrant provision
vagrant ssh-config <node>
```

## Troubleshooting

```bash
# Recreate the cluster
vagrant destroy -f
vagrant up

# Enable Vagrant debug logs
VAGRANT_LOG=debug vagrant up
```

## Notes

- Ansible uses Vagrant private keys from `.vagrant/machines/<node>/virtualbox/private_key`.
- Do not delete the `.vagrant` directory if you still use the current Ansible inventory.