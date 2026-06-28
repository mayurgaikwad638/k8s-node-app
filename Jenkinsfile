pipeline {
    agent any 

        environment {
            DOCKERHUB_USERNAME = 'kubemayurr'
            IMAGE_NAME = 'kubemayurr:myapp' 
            IMAGE_TAG = '${BUILD_NUMBER}'

        }

        stages {

            stage('code checkout') {
                steps{
                    checkout scm
                }
            }

            stage('docker build'){
                steps{
                    sh 'docker build -t $IMAGE_NAME:$IMAGE_TAG .' 
                }
            }

            stage('push to dockerhub'){
                steps{
                    withcredentials([usernamePassword(
                        credentialsId : 'docker-cred',
                        usernameVariable: 'docker_user',
                        passwordVariable: 'docker_pass'
                    )]){
                        sh 'echo $docker_pass | docker login -u $docker_user --password-stdin'
                        sh 'docker push $IMAGE_NAME:$IMAGE_TAG'
                    }
                }
            }

            stage('deploy'){
                when {
                    branch 'main'
                }
                        steps {
        withCredentials([file(credentialsId: 'kind-cluster-config', variable: 'KUBECONFIG')]) {
            sh '''
                sed -e "s|IMAGE_PLACEHOLDER|$IMAGE_NAME:$IMAGE_TAG|g" \
                    -e "s|BUILD_NUMBER_PLACEHOLDER|$BUILD_NUMBER|g" \
                    k8s/deployment.yaml > k8s/deployment-rendered.yaml

                kubectl apply -f k8s/deployment-rendered.yaml
                kubectl apply -f k8s/service.yaml
                kubectl rollout status deployment/demo-app -n default
            '''
        }
                    
            }
        }
    post {
        success {
            echo "Pipeline completed successfully — image $IMAGE_NAME:$IMAGE_TAG"
        }
        failure {
            echo "Pipeline failed — check console output above for the failing stage"
        }
    }  
}
}
