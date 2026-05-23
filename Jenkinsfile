pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        // GitHub
        GIT_REPO = 'https://github.com/SripaadaBhat/NotesAppDevOpsLab.git'
        GIT_BRANCH = 'main'

        // SonarQube
        SONAR_SCANNER = tool 'sonar-scanner'
        SONAR_PROJECT_KEY = 'notesapp'
        SONAR_PROJECT_NAME = 'NotesApp'

        // Docker
        DOCKER_IMAGE = 'notes-app'
        DOCKER_TAG = 'latest'

        
        

        // Azure
      
    }

    stages {

        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Clone Repository') {
            steps {
                git branch: "${GIT_BRANCH}",
                url: "${GIT_REPO}"
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('OWASP Dependency Check') {
            steps {
                withCredentials([string(credentialsId: 'nvd-api-key', variable: 'NVD_KEY')]) {
dependencyCheck additionalArguments: '--scan ./ --format XML --out dependency-check-report --nvdApiKey %NVD_KEY% --data C:\\jenkins-owasp-data',
odcInstallation: 'dependency-check'                }
dependencyCheckPublisher pattern: 'dependency-check-report/dependency-check-report.xml'            }
        }

        
stage('SonarQube Analysis') {
    steps {
        withSonarQubeEnv('SonarQube') {

            bat """
            ${SONAR_SCANNER}\\bin\\sonar-scanner.bat ^
            -Dsonar.projectKey=${SONAR_PROJECT_KEY} ^
            -Dsonar.projectName=${SONAR_PROJECT_NAME} ^
            -Dsonar.sources=. ^
            -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
            """
        }
    }
}

       

        stage('Build Docker Image') {
            steps {
                bat """
                docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .
                """
            }
        }

        stage('Run Docker Container') {
    steps {
        bat """
        docker rm -f notes-app-container

        docker run -d ^
        --name notes-app-container ^
        -p 3000:3000 ^
        ${DOCKER_IMAGE}:${DOCKER_TAG}
        """
    }
}

        stage('Push Docker Image to DockerHub') {
            steps {
                withDockerRegistry([credentialsId: 'dockerhub-creds', url: '']) {

                    bat """
                    docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} sripaada265/${DOCKER_IMAGE}:${DOCKER_TAG}

                    docker push sripaada265/${DOCKER_IMAGE}:${DOCKER_TAG}
                    """
                }
            }
        }

         stage('Deploy Frontend to Vercel') {
            steps {
                sh """
                npm install -g vercel

                vercel --prod \
                --token=${VERCEL_TOKEN} \
                --yes
                """
            }
        }
        

       
    }

    post {

        success {
            echo 'CI/CD Pipeline Executed Successfully!'
        }

        failure {
            echo 'Pipeline Failed!'
        }

        
    }
}