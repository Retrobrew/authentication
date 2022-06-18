pipeline{
    agent any

    stages{
        stage("SCM"){
            steps{
                checkout scm
            }
        }
        stage("Install"){
            steps{
                nodejs(nodeJSInstallationName: 'nodejs') {
                    sh 'npm install -g sonar-scanner'
                    sh 'npm install'
                }
            }
        }
        stage("Test"){
            steps{
                nodejs(nodeJSInstallationName: 'nodejs') {
                    sh 'npm test'
                }
            }
        }
        stage('SonarQube Analysis') {
            when {
                anyOf {
                    branch 'dev/master'; branch 'feat/**'; branch 'fix/**'; branch 'master'
                }
            }
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'MOLERO_SONAR_PASSWORD', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]){
                        nodejs(nodeJSInstallationName: 'nodejs') {
                            sh "sonar-scanner -Dsonar.branch.name=${env.BRANCH_NAME} -Dsonar.login=${PASSWORD} -Dsonar.host.url=http://192.168.1.3:9000"
                        }
                    }
                }
            }
        }
        stage("Deploy to dev environment"){
            when {
                branch 'dev/master'
            }
            steps{
                withCredentials([usernamePassword(credentialsId: 'MOLERO_HEROKU_PASSWORD', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]){
                    nodejs(nodeJSInstallationName: 'nodejs') {
                        sh('git push https://${USERNAME}:${PASSWORD}@git.heroku.com/retrobrew-authenticate.git HEAD:refs/heads/main')
                    }
                }
            }
        }
        stage("Deploy to prod environment"){
            when {
                branch 'master'
            }
            steps{
                withCredentials([usernamePassword(credentialsId: 'RETROBREW_BACK_PROD', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]){
                    nodejs(nodeJSInstallationName: 'nodejs'){
                        sh('sshpass -p ${PASSWORD} scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -P 22 dist/* ${USERNAME}@192.168.1.21:/home/prod/back/.')
                    }
                }
            }
        }
    }
}
