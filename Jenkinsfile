def setBranchEnvironment() {
    def branchEnv = [
        master: [
            DOCKER_IMAGE_NAME: "${env.REGISTRY_URL}/${env.PROJECT_NAME}/frontend",
            NAMESPACE: "${env.PROJECT_NAME}",
            NODOLABEL: "prod",
            DEPLOYMENT_NAME: "frontend-deploy",
            REPLICAS: "2"
        ],
        dev: [
            DOCKER_IMAGE_NAME: "${env.REGISTRY_URL}/${env.PROJECT_NAME}/dev/frontend",
            NAMESPACE: "${env.PROJECT_NAME}-dev",
            NODOLABEL: "dev",
            DEPLOYMENT_NAME: "frontend-deploy-dev",
            REPLICAS: "1"
        ]
    ]

    def envVars = branchEnv.get(env.BRANCH_NAME, [:])

    envVars.each { key, value ->
        env."$key" = value
    }

    if (!env.DOCKER_IMAGE_NAME) {
        error "Branch '${env.BRANCH_NAME}' is not configured. Please add it to the branchEnv map."
    }

    // Extract base image name (without version tag)
    def imageNameWithoutVersion = env.DOCKER_IMAGE_NAME.split(':')[0]

    // Set the final image name with the version tag
    env.DOCKER_IMAGE_NAME = "${imageNameWithoutVersion}:${env.VERSION_NUMBER}"
    echo "Building image: ${env.DOCKER_IMAGE_NAME}"
}

pipeline {
    agent any

    environment {
        PROJECT_NAME = "elogix"
        REGISTRY_URL = "registry.corvitmedellin.com"
        REGISTRY_CREDENTIALS_ID = 'ba48afc5-787b-4654-b61a-d20e26d46952'
        KUBECONFIG_ID = 'kubeconfig-corvit'
        KUBECONFIG_CREDENTIALS_ID = '65676e1e-3053-4d58-94a0-5c4a21299e96'
        K8S_SERVER_URL = 'https://masterk8s.corvitmedellin.com:6443'
    }

    parameters {
        choice(
            name: 'status',
            choices: ['Version', 'Check', 'Build', 'Push', 'Deploy', 'Rollout'],
            description: 'Select the build stage to execute'
        )
    }

    stages {
        stage('Set Version Number') {
            steps {
                script {
                    env.VERSION_NUMBER = VersionNumber([
                        versionNumberString: '${BUILD_MONTH}.${BUILD_WEEK}.${BUILD_DAY}.${BUILDS_TODAY}.${BUILD_NUMBER}',
                        projectStartDate: '2024-03-01',
                        versionPrefix: 'v1.'
                    ])
                    echo "versionNumber: ${env.VERSION_NUMBER}"
                }
            }
        }

        stage('Check Branch Environment') {
            steps {
                script {
                    setBranchEnvironment()
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    status = 'Build'
                    echo 'Building in Local Docker'
                    if (env.NODOLABEL == 'dev') {
                        env.CONFIGURATION = 'development'
                        sh """
                            docker build -f DockerfileDev -t ${env.DOCKER_IMAGE_NAME} ./
                        """
                    } else if (env.NODOLABEL == 'prod') {
                        env.CONFIGURATION = 'production'
                        sh """
                            docker build -f DockerfileProd -t ${env.DOCKER_IMAGE_NAME} ./
                        """
                    }
                }
            }
        }

        stage('Docker Push') {
            steps {
                script {
                    echo 'Sending to the private Registry'
                    withCredentials([usernamePassword(credentialsId: env.REGISTRY_CREDENTIALS_ID, usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh """
                            docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD ${env.REGISTRY_URL}
                            docker push ${env.DOCKER_IMAGE_NAME}
                        """
                    }
                }
            }
        }

        stage('Deploy Kubernetes') {
            steps {
                script {
                    echo 'Deploy in Kubernetes'
                    kubernetesDeploy(
                        kubeconfigId: env.KUBECONFIG_ID,
                        configs: 'deployment.yaml',
                        enableConfigSubstitution: true
                    )
                }
            }
        }

        stage('Apply Kubernetes files') {
            steps {
                withKubeConfig([credentialsId: env.KUBECONFIG_CREDENTIALS_ID, serverUrl: env.K8S_SERVER_URL]) {
                    sh 'kubectl rollout restart deployment/$DEPLOYMENT_NAME -n $NAMESPACE'
                }
            }
        }
    }
}
