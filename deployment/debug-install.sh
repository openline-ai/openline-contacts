#! /bin/bash

NAMESPACE_NAME="openline"
echo "script is $0"
CONTACTS_HOME="$(dirname $(readlink -f $0))/../"
echo "CONTACTS_HOME=$CONTACTS_HOME"

./prerequisites-install.sh

kubectl port-forward --namespace $NAMESPACE_NAME service/postgresql-customer-os-dev 5432:5432 &
kubectl port-forward --namespace $NAMESPACE_NAME service/neo4j-customer-os 7474:7474 &
kubectl port-forward --namespace $NAMESPACE_NAME service/neo4j-customer-os 7687:7687 &
kubectl port-forward --namespace $NAMESPACE_NAME svc/customer-os-api-service 10010:10010 &
kubectl port-forward --namespace $NAMESPACE_NAME service/contacts-api-service 9999:9999 &
kubectl port-forward --namespace $NAMESPACE_NAME service/contacts-gui-service 3000:3000 &
wait