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

        BASE_URL = credentials('BASE_URL')
        MONGO_DATABASE = credentials('MONGO_DATABASE')
        MONGO_COLLECTION = credentials('MONGO_COLLECTION')
        TEST_USER = credentials('TEST_USER')
        TEST_PASSWORD = credentials('TEST_PASSWORD')

        IMAGE_NAME = 'playwright-enterprise-framework'
        ENV_FILE = '.env.docker'

    }

    stages {

        stage('Checkout Source Code') {
            steps {
                echo '========== CHECKOUT =========='
                checkout scm
            }
        }

        stage('Generate Environment File') {
            steps {
                echo '========== GENERATE .env.docker =========='
                bat """
                (
                echo BASE_URL=%BASE_URL%
                echo MONGO_URI=mongodb://mongo:27017
                echo MONGO_DATABASE=%MONGO_DATABASE%
                echo MONGO_COLLECTION=%MONGO_COLLECTION%
                echo TEST_USER=%TEST_USER%
                echo TEST_PASSWORD=%TEST_PASSWORD%
                ) > .env.docker
                """
            }
        }

        stage('Build Docker Images') {
            steps {
                echo '========== BUILD DOCKER IMAGES =========='
                bat 'docker compose build'
            }
        }

        stage('Start MongoDB') {
            steps {
                echo '========== START MONGODB =========='
                bat 'docker compose up -d mongo'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                echo '========== RUN PLAYWRIGHT TESTS =========='

                script {

                    if (params.TEST_SUITE == 'all') {

                        bat """
                        docker compose run --rm ^
                        -e BASE_URL=%BASE_URL% ^
                        -e TEST_USER=%TEST_USER% ^
                        playwright ^
                        npx playwright test --project=${params.BROWSER}
                        """

                    } else {

                        bat """
                        docker compose run --rm ^
                        -e BASE_URL=%BASE_URL% ^
                        -e TEST_USER=%TEST_USER% ^
                        playwright ^
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

            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
            archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true
            archiveArtifacts artifacts: 'reports/**', allowEmptyArchive: true

            echo '========== STOP CONTAINERS =========='

            bat 'docker compose down'

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