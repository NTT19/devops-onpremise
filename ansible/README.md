ansible-playbook -i inventory/production/hosts.yml playbooks/tune-sqlserver-linux.yml
ansible-playbook -i inventory/production/hosts.yml playbooks/install-sqlserver.yml --ask-vault-pass
ansible-playbook -i inventory/production/hosts.yml playbooks/install-sqlserver-tools.yml
ansible-playbook -i inventory/production/hosts.yml playbooks/configure-sqlserver.yml
ansible-playbook -i inventory/production/hosts.yml playbooks/create-databases.yml --ask-vault-pass
ansible-playbook -i inventory/production/hosts.yml playbooks/verify-sqlserver.yml --ask-vault-pass