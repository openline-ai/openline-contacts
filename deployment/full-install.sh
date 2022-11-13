#! /bin/bash

NAMESPACE_NAME="openline"
echo "script is $0"
CONTACTS_HOME="$(dirname $(readlink -f $0))/../"
echo "CONTACTS_HOME=$CONTACTS_HOME"

./prerequisites-install.sh

cd  $CONTACTS_HOME

if [ "x$1" == "xbuild" ]; then
  if [ "x$(lsb_release -i|cut -d: -f 2|xargs)" == "xUbuntu" ];
  then
    if [ -z "$(which go)" ];
    then
	    sudo apt-get update
	    sudo apt-get install -y golang-go
	    mkdir -p ~/go/{bin,src,pkg}
	    export GOPATH="$HOME/go"
	    export GOBIN="$GOPATH/bin"
    fi
  fi

  cd $CONTACTS_HOME/contacts-api;go build -v;
  docker build -t ghcr.io/openline-ai/openline-contacts/contacts-api:otter -f Dockerfile .

  cd $CONTACTS_HOME/contacts-gui
  docker build -t ghcr.io/openline-ai/openline-contacts/contacts-gui:otter --platform linux/amd64 -f Dockerfile .
else
  docker pull ghcr.io/openline-ai/openline-contacts/contacts-api:otter
  docker pull ghcr.io/openline-ai/openline-contacts/contacts-gui:otter
fi

minikube image load ghcr.io/openline-ai/openline-contacts/contacts-api:otter --daemon
minikube image load ghcr.io/openline-ai/openline-contacts/contacts-gui:otter --daemon

cd $CONTACTS_HOME/deployment/k8s/local-minikube

kubectl apply -f contacts-gui-deployment.yaml --namespace $NAMESPACE_NAME
kubectl apply -f contacts-gui-service.yaml --namespace $NAMESPACE_NAME

kubectl apply -f contacts-api-deployment.yaml --namespace $NAMESPACE_NAME
kubectl apply -f contacts-api-service.yaml --namespace $NAMESPACE_NAME

pod=$(kubectl get pods -n $NAMESPACE_NAME|grep contacts-api|grep Running| cut -f1 -d ' ')
while [ -z "$pod" ]; do
  pod=$(kubectl get pods -n $NAMESPACE_NAME|grep contacts-api|grep Running| cut -f1 -d ' ')
  if [ -z "$pod" ]; then
    echo "contacts-api not ready waiting"
    sleep 1
  fi
  sleep 1
done

pod=$(kubectl get pods -n $NAMESPACE_NAME|grep contacts-gui|grep Running| cut -f1 -d ' ')
while [ -z "$pod" ]; do
  pod=$(kubectl get pods -n $NAMESPACE_NAME|grep contacts-gui|grep Running| cut -f1 -d ' ')
  if [ -z "$pod" ]; then
    echo "contacts-api not ready waiting"
    sleep 1
  fi
  sleep 1
done

kubectl port-forward --namespace $NAMESPACE_NAME service/postgresql-customer-os-dev 5432:5432 &
kubectl port-forward --namespace $NAMESPACE_NAME service/neo4j-customer-os 7474:7474 &
kubectl port-forward --namespace $NAMESPACE_NAME service/neo4j-customer-os 7687:7687 &
kubectl port-forward --namespace $NAMESPACE_NAME svc/customer-os-api-service 10010:10010 &
kubectl port-forward --namespace $NAMESPACE_NAME service/contacts-api-service 9999:9999 &
kubectl port-forward --namespace $NAMESPACE_NAME service/contacts-gui-service 3000:3000 &
wait