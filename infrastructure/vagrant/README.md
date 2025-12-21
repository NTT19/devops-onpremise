# DevOps On-Premise Infrastructure

Dự án này sử dụng Vagrant và VirtualBox để tạo môi trường infrastructure on-premise cho việc phát triển và testing.

## 📋 Yêu cầu hệ thống

- [Vagrant](https://www.vagrantup.com/downloads) >= 2.2.0
- [VirtualBox](https://www.virtualbox.org/wiki/Downloads) >= 6.1
- Tối thiểu 8GB RAM (khuyến nghị 16GB)
- Tối thiểu 50GB dung lượng ổ đĩa trống

## 🏗️ Cấu trúc dự án

```
.
├── Vagrantfile              # File cấu hình chính
├── .vagrant/                # Thư mục metadata của Vagrant (tự động tạo)
│   ├── machines/            # Thông tin các máy ảo
│   │   ├── master/
│   │   ├── worker1/
│   │   └── worker2/
│   └── bundler/
└── .vagrant.d/              # Thư mục cấu hình global
    ├── boxes/               # Box images đã tải
    └── insecure_private_keys/
```

## 🚀 Bắt đầu sử dụng

### 1. Clone repository

```bash
git clone <repository-url>
cd infrastructure/vagrant
```

### 2. Khởi động toàn bộ cluster

```bash
# Khởi động tất cả các máy ảo
vagrant up

# Hoặc khởi động từng máy riêng lẻ
vagrant up master
vagrant up worker1
vagrant up worker2
```

### 3. Truy cập vào máy ảo

```bash
# SSH vào master node
vagrant ssh master

# SSH vào worker node
vagrant ssh worker1
vagrant ssh worker2
```

## 📦 Box được sử dụng

Dự án sử dụng **Ubuntu 18.04 LTS (Bionic Beaver)** - box: `ubuntu/bionic64`

Chi tiết box:
- **Version**: 20230607.0.5
- **Provider**: VirtualBox
- **Location**: [.vagrant.d/boxes/ubuntu-VAGRANTSLASH-bionic64/20230607.0.5/virtualbox](.vagrant.d/boxes/ubuntu-VAGRANTSLASH-bionic64/20230607.0.5/virtualbox)

## ⚙️ Cấu hình mặc định

Các máy ảo được cấu hình sẵn với:

- ✅ Hệ điều hành đã được update
- ✅ Swap đã bị disable (cần thiết cho Kubernetes)
- ✅ Công cụ cơ bản: `curl`, `wget`, `vim`, `net-tools`
- ✅ Serial console logging được cấu hình

## 🔧 Các lệnh Vagrant thường dùng

### Quản lý máy ảo

```bash
# Xem trạng thái các máy ảo
vagrant status

# Xem trạng thái global
vagrant global-status

# Dừng máy ảo
vagrant halt [machine-name]

# Khởi động lại
vagrant reload [machine-name]

# Xóa máy ảo
vagrant destroy [machine-name]

# Xóa tất cả
vagrant destroy -f
```

### Provisioning

```bash
# Chạy lại provisioning
vagrant provision [machine-name]

# Reload và provision
vagrant reload --provision [machine-name]
```

### SSH

```bash
# SSH vào máy ảo
vagrant ssh [machine-name]

# Xem cấu hình SSH
vagrant ssh-config [machine-name]
```

## 📝 Tùy chỉnh cấu hình

Để thay đổi cấu hình, chỉnh sửa [Vagrantfile](Vagrantfile):

```ruby
config.vm.define "master" do |master|
  master.vm.hostname = "master"
  master.vm.network "private_network", ip: "192.168.56.10"
  
  master.vm.provider "virtualbox" do |vb|
    vb.memory = "2048"
    vb.cpus = 2
  end
end
```

## 🐛 Troubleshooting

### Lỗi khởi động máy ảo

```bash
# Xóa và tạo lại
vagrant destroy -f
vagrant up
```

### Lỗi network

```bash
# Kiểm tra VirtualBox Host-Only Network
VBoxManage list hostonlyifs

# Xóa cache network
vagrant reload
```

### Lỗi box corrupt

```bash
# Xóa box và tải lại
vagrant box remove ubuntu/bionic64
vagrant box add ubuntu/bionic64
```

### Xem logs

```bash
# Console logs
cat .vagrant/machines/master/virtualbox/ubuntu-bionic-18.04-cloudimg-console.log

# Vagrant logs với debug
VAGRANT_LOG=debug vagrant up
```

## 📚 Tài liệu tham khảo

- [Vagrant Documentation](https://www.vagrantup.com/docs)
- [VirtualBox Documentation](https://www.virtualbox.org/manual/)
- [Ubuntu Cloud Images](https://cloud-images.ubuntu.com/)