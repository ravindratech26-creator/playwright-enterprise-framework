pipeline {

    agent any

    options {
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    parameters {

        choice(
            name: 'ENVIRONMENT',
            choices: ['dev', 'qa', 'uat'],
            description: 'Select Target Environment'
        )

        choice(
            name: 'BROWSER',
            choices: ['chromium', 'firefox', 'webkit', 'all'],
            description: 'Select Browser (all = run chromium/firefox/webkit in parallel)'
        )

        choice(
            name: 'TEST_SUITE',
            choices: [
                'all',
                'tests/login'
            ],
            description: 'Select Test Suite'
        )

        choice(
            name: 'TAG',
            choices: ['all', 'smoke', 'regression'],
            description: 'Select Test Tag'
        )

    }

    environment {

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

        stage('Lint & Format Check') {
            steps {
                echo '========== LINT & FORMAT CHECK =========='
                bat 'npm ci'
                bat 'npm run lint'
                bat 'npm run format:check'
            }
        }

        stage('Generate Environment File') {
            steps {
                echo "========== GENERATE .env.docker FOR ${params.ENVIRONMENT} =========="
                script {
                    withCredentials([
                        string(credentialsId: "${params.ENVIRONMENT}-BASE_URL", variable: 'ENV_BASE_URL'),
                        string(credentialsId: "${params.ENVIRONMENT}-MONGO_DATABASE", variable: 'ENV_MONGO_DATABASE'),
                        string(credentialsId: "${params.ENVIRONMENT}-MONGO_COLLECTION", variable: 'ENV_MONGO_COLLECTION'),
                        string(credentialsId: "${params.ENVIRONMENT}-TEST_USER", variable: 'ENV_TEST_USER'),
                        string(credentialsId: "${params.ENVIRONMENT}-TEST_PASSWORD", variable: 'ENV_TEST_PASSWORD')
                    ]) {
                        bat """
                        (
                        echo BASE_URL=%ENV_BASE_URL%
                        echo MONGO_URI=mongodb://mongo:27017
                        echo MONGO_DATABASE=%ENV_MONGO_DATABASE%
                        echo MONGO_COLLECTION=%ENV_MONGO_COLLECTION%
                        echo TEST_USER=%ENV_TEST_USER%
                        echo TEST_PASSWORD=%ENV_TEST_PASSWORD%
                        ) > .env.docker
                        """
                    }
                }
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

                    def suiteArg = (params.TEST_SUITE == 'all') ? '' : params.TEST_SUITE
                    def tagArg = (params.TAG == 'all') ? '' : "--grep @${params.TAG}"

                    def runBrowser = { String browser ->
                        bat """
                        docker compose run --rm ^
                        -e REPORT_SUFFIX=${browser} ^
                        playwright ^
                        npx playwright test ${suiteArg} --project=${browser} ${tagArg}
                        """
                    }

                    if (params.BROWSER == 'all') {
                        parallel(
                            chromium: { runBrowser('chromium') },
                            firefox: { runBrowser('firefox') },
                            webkit: { runBrowser('webkit') }
                        )
                    } else {
                        runBrowser(params.BROWSER)
                    }

                }
            }
        }

    }

    post {

        always {

            echo '========== COPY REPORTS =========='

            archiveArtifacts artifacts: 'playwright-report*/**', allowEmptyArchive: true
            archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true
            archiveArtifacts artifacts: 'reports/**', allowEmptyArchive: true
            archiveArtifacts artifacts: 'allure-results*/**', allowEmptyArchive: true

            echo '========== PUBLISH ALLURE REPORT =========='

            script {
                def allureDirs = (params.BROWSER == 'all')
                    ? [[path: 'allure-results-chromium'], [path: 'allure-results-firefox'], [path: 'allure-results-webkit']]
                    : [[path: "allure-results-${params.BROWSER}"]]

                allure includeProperties: false, jdk: '', results: allureDirs
            }

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
