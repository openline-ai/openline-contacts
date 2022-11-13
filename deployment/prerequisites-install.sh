#! /bin/bash

NAMESPACE_NAME="openline"
echo "script is $0"
CONTACTS_HOME="$(dirname $(readlink -f $0))/.."
echo "CONTACTS_HOME=$CONTACTS_HOME"
CUSTOMER_OS_HOME_FROM_CONTACTS="$CONTACTS_HOME/../openline-customer-os"

function getCustomerOs () {
  if [ ! -d $CUSTOMER_OS_HOME_FROM_CONTACTS ];
  then
    cd "$CONTACTS_HOME/../"
    git clone https://github.com/openline-ai/openline-customer-os.git
  fi
}

if [ -z "$(which kubectl)" ] || [ -z "$(which docker)" ] || [ -z "$(which minikube)" ] ; 
then
  if [ -z "$(which docker)" ]; 
  then
    INSTALLED_DOCKER=1
  else
    INSTALLED_DOCKER=0
  fi
  getCustomerOs
  if [ "x$(lsb_release -i|cut -d: -f 2|xargs)" == "xUbuntu" ];
  then
    echo "missing base dependencies, installing"
    $CUSTOMER_OS_HOME_FROM_CONTACTS/deployment/k8s/local-minikube/0-ubuntu-install-prerequisites.sh
  fi
  if [ "x$(uname -s)" == "xDarwin" ]; 
  then
    echo "Base env not ready, follow up the setup procedure at the following link"
    echo "https://github.com/openline-ai/openline-customer-os/tree/otter/deployment/k8s/local-minikube#setup-environment-for-osx"
    exit
  fi
  if [ $INSTALLED_DOCKER == 1 ];
  then 
    echo "Docker has just been installed"
    echo "Please logout and log in for the group changes to take effect"
    echo "Once logged back in, re-run this script to resume the installation"
    exit
  fi
fi

MINIKUBE_STATUS=$(minikube status)
MINIKUBE_STARTED_STATUS_TEXT='Running'
if [[ "$MINIKUBE_STATUS" == *"$MINIKUBE_STARTED_STATUS_TEXT"* ]];
  then
     echo " --- Minikube already started --- "
  else
     eval $(minikube docker-env)
     minikube start &
     wait
fi

if [[ $(kubectl get namespaces) == *"$NAMESPACE_NAME"* ]];
then
  echo "Customer OS Base already installed"
else
  echo "Installing Customer OS Base"
  getCustomerOs
  chmod +x $CUSTOMER_OS_HOME_FROM_CONTACTS/deployment/k8s/local-minikube/1-deploy-customer-os-base-infrastructure-local.sh
  $CUSTOMER_OS_HOME_FROM_CONTACTS/deployment/k8s/local-minikube/1-deploy-customer-os-base-infrastructure-local.sh
fi

if [ -z "$(kubectl get deployment customer-os-api -n $NAMESPACE_NAME)" ];
then
  echo "Installing Customer OS Applications"
  getCustomerOs
  chmod +x $CUSTOMER_OS_HOME_FROM_CONTACTS/deployment/k8s/local-minikube/2-build-deploy-customer-os-local-images.sh $1
  $CUSTOMER_OS_HOME_FROM_CONTACTS/deployment/k8s/local-minikube/2-build-deploy-customer-os-local-images.sh $1
fi

pod=$(kubectl get pods -n $NAMESPACE_NAME|grep customer-os-api|grep Running| cut -f1 -d ' ')
while [ -z "$pod" ]; do
  pod=$(kubectl get pods -n $NAMESPACE_NAME|grep customer-os-api|grep Running| cut -f1 -d ' ')
  if [ -z "$pod" ]; then
    echo "customer-os-api not ready waiting"
    sleep 1
  fi
  sleep 1
done