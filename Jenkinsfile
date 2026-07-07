pipeline {

    agent any

    tools {
        nodejs 'NodeJS-24'
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing npm packages...'
                bat 'npm ci'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                echo 'Installing Playwright browsers...'
                bat 'npx playwright install'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                echo "Running tests on ${params.BROWSER}"
                bat "npx playwright test --project=${params.BROWSER}"
            }
        }

    }

    post {

        always {

            archiveArtifacts artifacts: 'playwright-report/**', fingerprint: true

            archiveArtifacts artifacts: 'test-results/**', fingerprint: true

        }

        success {
            echo 'Playwright Tests Passed Successfully!'
        }

        failure {
            echo 'Playwright Tests Failed!'
        }

    }

}