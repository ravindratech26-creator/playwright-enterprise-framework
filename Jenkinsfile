pipeline {

    agent any

    options {
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    parameters {

        choice(
            name: 'BROWSER',
            choices: ['chromium', 'firefox', 'webkit'],
            description: 'Select Browser'
        )

        choice(
            name: 'TEST_SUITE',
            choices: [
                'all',
                'tests/login',
                'tests/cart',
                'tests/checkout'
            ],
            description: 'Select Test Suite'
        )
    }

    environment {
        IMAGE_NAME = 'playwright-enterprise-framework'

        BASE_URL = credentials('BASE_URL')
        USERNAME = credentials('APP_USERNAME')
        PASSWORD = credentials('APP_PASSWORD')
    }

    stages {

        stage('Checkout Source Code') {
            steps {
                echo '========== CHECKOUT =========='
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '========== BUILD DOCKER IMAGE =========='
                bat "docker build -t %IMAGE_NAME% ."
            }
        }

        stage('Run Playwright Tests') {
            steps {
                script {

                    if (params.TEST_SUITE == 'all') {

                        bat """
                        docker run --rm ^
                        -e BASE_URL=%BASE_URL% ^
                        -e APP_USERNAME=%APP_USERNAME% ^
                        -e APP_PASSWORD=%APP_PASSWORD% ^
                        %IMAGE_NAME% ^
                        npx playwright test --project=${params.BROWSER}
                        """

                    } else {

                        bat """
                        docker run --rm ^
                        -e BASE_URL=%BASE_URL% ^
                        -e USERNAME=%USERNAME% ^
                        -e PASSWORD=%PASSWORD% ^
                        %IMAGE_NAME% ^
                        npx playwright test ${params.TEST_SUITE} --project=${params.BROWSER}
                        """

                    }
                }
            }
        }

    }

    post {

        always {

            echo '========== COPY REPORTS =========='

            bat "docker image rm %IMAGE_NAME% || exit /b 0"

            archiveArtifacts artifacts: 'playwright-report/**', fingerprint: true, allowEmptyArchive: true

            archiveArtifacts artifacts: 'test-results/**', fingerprint: true, allowEmptyArchive: true

            archiveArtifacts artifacts: 'reports/**', fingerprint: true, allowEmptyArchive: true

        }

        success {
            echo 'Playwright Tests Passed Successfully.'
        }

        failure {
            echo 'Playwright Tests Failed.'
        }

        cleanup {
            cleanWs()
        }

    }

}