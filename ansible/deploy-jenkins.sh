#!/bin/bash

# Kiểm tra Ansible đã cài chưa
if ! command -v ansible-playbook &> /dev/null
then
    echo "Ansible chưa được cài, hãy cài Ansible trước khi chạy script này."
    exit 1
fi

# Chạy playbook chỉ trên host jenkins
ansible-playbook site.yml --limit jenkins