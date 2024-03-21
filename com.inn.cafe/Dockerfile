
FROM openjdk:17-jdk-slim

WORKDIR /app

RUN apt-get update --fix-missing && apt-get install -y maven

COPY pom.xml .

RUN mvn dependency:go-offline

COPY . .

RUN mvn clean install -DskipTests

EXPOSE 8081

# ENV CLOUDINARY_URL=cloudinary://597679583287735:6vxnxiNtLGOovgIItf_LhVB5GAg@dzi8lavyv

CMD ["java", "-jar", "target/com.inn.cafe-0.0.1-SNAPSHOT.jar"]