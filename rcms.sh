#!/bin/sh
rcms_help()
{
  echo "";
  echo "Management options:";
  echo "";
  echo "--deployment                   Create images, containers and build dependencies";
  echo "--start-development            Create containers and start services";
  echo "--start-production             Create containers and start services";
  echo "--start-production-stack       Use Docker deploy stack";
  echo "--restart-development          Restart services";
  echo "--restart-production           Restart services";
  echo "--stop-development             Stop services";
  echo "--stop-production              Stop services";
  echo "--stop-production-stack        Stop and remove stack services";
  echo "--remove-development           Remove containers";
  echo "--remove-production            Remove containers";
  echo "--install-dependencies         Install dependencies";
  echo "--build-images                 Build images";
  echo "";
  echo "If you want to show some container logs you can run:";
  echo "\$docker logs <container-name> -f --tail 100";
}

rcms_deployment()
{
  echo "Deployment";
  base_dir=./docker/;
  mkdir -p ${base_dir}../database/data/db/;
  mkdir -p ${base_dir}../database/data/mongodb/;
  docker build -f ${base_dir}dockerfile/dockerfile-mongodb -t rcms-mongodb-img .;
  docker build -f ${base_dir}dockerfile/dockerfile-nginx -t rcms-nginx-img .;
  docker build -f ${base_dir}dockerfile/dockerfile-nodejs -t rcms-nodejs-img .;
  docker-compose -f ${base_dir}build/rcms-nodejs-builder.yml run --rm rcms-install;
  echo "Deployment finished";
  echo "For next steps run: rcms.sh after-deploying"
}

rcms_start_development()
{
  echo "Starting development";
  echo "";
  base_dir=./docker/development/;
  docker-compose -f ${base_dir}docker-compose.yml -p rcms-development up -d;
  echo "";
  echo "Starting development finished";
}

rcms_start_production()
{
  echo "Starting production";
  echo "";
  base_dir=./docker/production/;
  docker-compose -f ${base_dir}docker-compose.yml -p rcms-production up -d;
  docker-compose -f ${base_dir}rcms-dashboard-app-production.yml run --rm rcms-install;
  echo "";
  echo "Starting production finished";
}

rcms_start_production_stack()
{
  echo "Starting production stack";
  echo "";
  base_dir=./docker/production/;
  docker stack deploy -c ${base_dir}docker-compose.yml rcms-production;
  docker-compose -f ${base_dir}rcms-dashboard-app-production.yml run --rm rcms-install;
  echo "";
  echo "Starting production stack finished";
}

rcms_stop_development()
{
  echo "Stopping development";
  echo "";
  base_dir=./docker/development/;
  docker-compose -f ${base_dir}docker-compose.yml -p rcms-development stop;
  echo "";
  echo "Stopping development finished";
}

rcms_stop_production()
{
  echo "Stopping production";
  echo "";
  base_dir=./docker/production/;
  docker-compose -f ${base_dir}docker-compose.yml -p rcms-production stop;
  echo "";
  echo "Stopping production finished";
}

rcms_stop_production_stack()
{
  echo "Stopping production stack";
  echo "";
  docker stack rm rcms-production
  echo "";
  echo "Stopping production stack finished";
}

rcms_restart_development()
{
  echo "Restarting development";
  echo "";
  base_dir=./docker/development/;
  docker-compose -f ${base_dir}docker-compose.yml -p rcms-development stop;
  docker-compose -f ${base_dir}docker-compose.yml -p rcms-development start;
  echo "";
  echo "Restarting development finished";
}

rcms_restart_production()
{
  echo "Restarting production";
  echo "";
  base_dir=./docker/production/;
  docker-compose -f ${base_dir}docker-compose.yml -p rcms-production stop;
  docker-compose -f ${base_dir}docker-compose.yml -p rcms-production start;
  echo "";
  echo "Restarting production finished";
}

rcms_remove_development()
{
  echo "Removing development";
  echo "";
  base_dir=./docker/development/;
  docker-compose -f ${base_dir}docker-compose.yml -p rcms-development down;
  echo "";
  echo "Removing development finished";
}

rcms_remove_production()
{
  echo "Removing production";
  echo "";
  base_dir=./docker/production/;
  docker-compose -f ${base_dir}docker-compose.yml -p rcms-production down;
  echo "";
  echo "Removing production finished";
}

rcms_install_dependencies()
{
  echo "Installing dependencies";
  echo "";
  base_dir=./docker/;
  docker-compose -f ${base_dir}build/rcms-nodejs-builder.yml run --rm rcms-install;
  echo "";
  echo "Installing dependencies finished";
}

rcms_build_images() {
  echo "Building images";
  echo "";
  base_dir=./docker/;
  docker build --no-cache -f ${base_dir}dockerfile/dockerfile-mongodb -t rcms-mongodb-img .;
  docker build --no-cache -f ${base_dir}dockerfile/dockerfile-nginx -t rcms-nginx-img .;
  docker build --no-cache -f ${base_dir}dockerfile/dockerfile-nodejs -t rcms-nodejs-img .;
  echo ""
  echo "Building images finished";
}


echo "== REACTIVE CMS ==";
case $1 in
--deployment)
	rcms_deployment;
	;;
--start-development)
	rcms_start_development;
	;;
--start-production)
	rcms_start_production;
	;;
--start-production-stack)
  rcms_start_production_stack;
  ;;
--stop-development)
  rcms_stop_development;
	;;
--stop-production)
	rcms_stop_production;
	;;
--stop-production-stack)
  rcms_stop_production_stack;
  ;;
--restart-development)
  rcms_restart_development;
	;;
--restart-production)
	rcms_restart_production;
	;;
--remove-development)
	rcms_remove_development;
	;;
--remove-production)
	rcms_remove_production;
	;;
--install-dependencies)
	rcms_install_dependencies;
  ;;
--build-images)
  rcms_build_images;
  ;;
--help)
  rcms_help;
  ;;
*)
  rcms_help;
  echo "";
  echo "Version. 1.0.0 beta";
  echo "";
	;;
esac
