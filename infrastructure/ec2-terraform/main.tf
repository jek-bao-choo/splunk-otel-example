# main.tf

# 1) Specify the provider and AWS region
provider "aws" {
  region = "ap-southeast-1"
}

# 2) Create an EC2 instance using resource "<PROVIDER>_<RESOURCE_TYPE>" "<LOCAL_NAME>"
resource "aws_instance" "jek_ec2_ubuntu" {
  ami = "ami-0672fd5b9210aa093"
  instance_type = "t2.xlarge"
  key_name = "jek-aws-rsa-key"
  subnet_id = "subnet-05b1a621ab83ee189"
  vpc_security_group_ids = ["sg-0a7a40aeb612d88bc"]
  associate_public_ip_address = true
  root_block_device {
    volume_size = 30
    volume_type = "gp3"
  }

  tags = {
    Name = "jek-ubuntu-24dot04"
    Env = "test"
    Owner = "jek"
    Criticality = "low"
  }
}
