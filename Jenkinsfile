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
            description: 'Select Playwright Browser'
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
        IMAGE_NAME = 'playwright-framework'
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
                        -e BROWSER=${params.BROWSER} ^
                        %IMAGE_NAME%
                        """

                    } else {

                        bat """
                        docker run --rm ^
                        -e BROWSER=${params.BROWSER} ^
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

            echo '========== PIPELINE COMPLETED =========='

            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true

            archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true

            archiveArtifacts artifacts: 'logs/**', allowEmptyArchive: true

        }

        success {

            echo 'SUCCESS : Playwright execution completed successfully.'

        }

        failure {

            echo 'FAILED : Playwright execution failed.'

        }

        cleanup {

            bat 'docker image prune -f'

        }

    }

}