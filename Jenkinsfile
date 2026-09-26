pipeline {

    agent any

    environment {
        IMAGE_NAME = 'pavanblocktech/webapp'
        CONTAINER_NAME = 'myapp'
        APP_PORT = '3000'
    }

    stages {

        stage('Pull Code') {
            steps {
                checkout scm
            }
        }
        
        stage('Check Files') {
            steps {
                sh '''
                    pwd
                    ls -la
                    find . -maxdepth 2 -name package-lock.json -o -name package.json
                '''
            }
        }

        stage('Set Environment') {
            steps {
                sh '''
                    node --version
                    npm --version
                    docker --version
                '''
            }
        }
        
        stage('Install Dependencies') {
            steps {
                dir('react-web-app') {
                    sh 'npm ci'
                }
            }
        }

        stage('Lint Code') {
            steps {
                dir('react-web-app') {
                    sh 'npm run lint'
                }
            }
        }

        stage('Build Application') {
            steps {
                dir('react-web-app') {
                    sh 'npm run build'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                dir('react-web-app') {
                    sh '''
                        docker build \
                            -t ${IMAGE_NAME}:${BUILD_NUMBER} \
                            -t ${IMAGE_NAME}:latest .
                    '''
                }
            }
        }

        stage('Push to Container Registry') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {

                    sh '''
                        echo "$DOCKER_PASSWORD" | \
                        docker login \
                        -u "$DOCKER_USERNAME" \
                        --password-stdin

                        docker push ${IMAGE_NAME}:${BUILD_NUMBER}
                        docker push ${IMAGE_NAME}:latest
                    '''
                }
            }
        }

        stage('Deploy Application') {
            steps {
                sh '''
                    docker rm -f ${CONTAINER_NAME} || true

                    docker pull ${IMAGE_NAME}:${BUILD_NUMBER}

                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        -p ${APP_PORT}:80 \
                        ${IMAGE_NAME}:${BUILD_NUMBER}
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    sleep 5

                    curl --fail \
                        http://localhost:${APP_PORT}
                '''
            }
        }
    }

    post {

        success {
            echo '======================================'
            echo 'APPLICATION DEPLOYED SUCCESSFULLY'
            echo '======================================'
        }

        failure {
            echo '======================================'
            echo 'PIPELINE FAILED'
            echo '======================================'
        }

        always {
            echo 'Pipeline execution completed.'
        }
    }
}