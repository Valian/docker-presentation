<template lang='pug'>
.eg-theme-agrume
  #business-logic.eg-slideshow
    slide(enter="fadeIn", leave="fadeOut")
      h1 Introduction to Docker

      h2 Jakub Skałecki @jskalc
      h4.u-text-centered Mindspace, 28.03.2019

    slide(enter="fadeIn", leave="fadeOut", steps="3")
      h2 About me
      ul(v-if="step === 1")
        li Currently Technical Team Leader at VideoBeat
        li CTO at <a href='https://pvpc.eu'>PvP Center</a>
        li Backend, DevOps, Frontend, GameDev, Machine Learning...
        li Blogger (sometimes)
        li Polyglot programmer, technology enthusiast
      h3(v-if="step === 2") Using docker everywhere for 4 years
      h3(v-if="step === 3") This presentation was created with Docker help :)


    slide(enter="fadeIn", leave="fadeOut")
      .u-text-centered
        img.presentation-image--solo(src="./assets/docker.svg")

    slide(enter="fadeIn", leave="fadeOut", steps="2")
      h2 Docker is a solution
      eg-transition.u-text-centered(enter='bounceInLeft', leave='fadeOut', v-if="step === 2")
          h1 But what is the problem?

    slide(enter="fadeIn", leave="fadeOut", steps="4")
      br
      eg-transition(v-if="step > 1", enter='bounceInLeft', leave='fadeOut')
        h3 Development environment setup & updates
      eg-transition(v-if="step > 2", enter='bounceInLeft', leave='fadeOut')
        h3 Predictable, repeatable deployment
      eg-transition(v-if="step > 3", enter='bounceInLeft', leave='fadeOut')
        h3 Server resource utilization

    slide(enter="fadeIn", leave="fadeOut", steps="3")
      h2 Let's focus on the first one
      h2(v-if="step > 1") Development setup
      h3(v-if="step === 3") How are you dealing with it?

    slide(enter="fadeIn", leave="fadeOut", steps="5")
      h2 Development setup
      p Previous approaches (my experience)
      ul(v-if="step > 1 && step < 5")
        li manual configuration using never written, "tribal knowledge" how to setup things
        li(v-if="step > 2") no separation between projects - different version of database anyone?
        li(v-if="step > 3") Virtual machines are a partial solution, but adds overhead
      .u-text-centered
        img.presentation-image(src="./assets/ha-ha-works-on-my-machine.jpg", v-if="step > 4")

    slide(enter="fadeIn", leave="fadeOut", steps="2")
      h2 How Docker can help you?
      eg-transition.u-text-centered(enter='bounceInLeft', leave='fadeOut', v-if="step === 2")
        h1 What is docker, after all?

    slide(enter="fadeIn", leave="fadeOut", steps="4")
      h2 My docker definition
      eg-transition.u-text-centered(enter='bounceInLeft', leave='fadeOut', v-if="step > 1")
        blockquote Docker is a framework to predictably create and run isolated, lightweight containers

      h2(v-if="step > 2") And container?
      eg-transition.u-text-centered(enter='bounceInLeft', leave='fadeOut', v-if="step > 3")
        blockquote Container is a standard unit of software that packages up code and all its dependencies

    slide(enter="fadeIn", leave="fadeOut", steps="2")
      h2 Hello world
      highlight-code.eg-code-block.code-box(lang="bash", v-if="step === 1").
        # -i and -t are needed to connect input / output to the container
        docker container run -it python

        # after a while, it will show up
        Python 3.7.1 (default, Oct 24 2018, 22:35:30)
        [GCC 6.3.0 20170516] on linux
        Type "help", "copyright", "credits" or "license" for information.
        >>>|

      cinema-player.u-text-centered(id="902zfwSgmDLLk58JCEoHqZIvr", size="regular", v-if="step === 2")

    slide(enter="fadeIn", leave="fadeOut")
      .u-text-centered
        eg-transition.u-text-centered(enter='bounceInLeft', leave='fadeOut')
          img.presentation-image--solo(src="./assets/magic.gif", width="80%")


    slide(enter="fadeIn", leave="fadeOut", steps="5")
      h2 Hello world explanation
      ul
        li(v-if="step > 1") First, docker checks if image called python:alpine exists locally
        li(v-if="step > 2") Since it doesn't, it checks if image exists in remote registry
        li(v-if="step > 3") Yes, <a href="https://hub.docker.com/_/python/">it exists</a>, so docker pulls it
        li(v-if="step > 4") And starts a container from python image with a command defined in the image <pre>python</pre>

    slide(enter="fadeIn", leave="fadeOut", steps="4")
      h2 Docker hub
      p Biggest collection of publicly-available, actively maintained images
      ul(v-if="step > 1")
        li postgres? Sure!
        li mysql? Of course!
        li redis, rabbitmq, nginx? Also!
        li your favourite language? I bet it's there!
        li(v-if="step > 2") literally <strong>anything</strong>
      p(v-if="step > 3") You can create and upload your own

    slide(enter="fadeIn", leave="fadeOut", steps="4")
      h2 Docker image
      eg-transition.u-text-centered(enter='bounceInLeft', leave='fadeOut', v-if="step > 1")
        blockquote A snapshot of a container, used to create other containers
      h3(v-if="step > 2") OOP analogy
      eg-transition.u-text-centered(enter='bounceInLeft', leave='fadeOut', v-if="step > 3")
        blockquote Image is a class, container is an object

    slide(enter="fadeIn", leave="fadeOut", steps="2")
      h2 Basic workflow demo

      highlight-code.eg-code-block.code-box(lang="bash", v-if="step === 1").
        # download the newest version of the image
        docker image pull postgres

        # run in background, exposing port 5432 to host
        docker run -d --name database -p 5432:5432 postgres

        # display running containers
        docker ps

        # start / stop / remove container
        docker stop / start / rm database

        # remove image
        docker image rm postgres
      cinema-player.u-text-centered(id="gULNnYKTNR7efjbe7DST3SPqn", size="regular", v-if="step === 2")

    slide(enter="fadeIn", leave="fadeOut", steps="2")
      h2 Dockerfile
      eg-transition.u-text-centered(enter='bounceInLeft', leave='fadeOut', v-if="step > 1")
        blockquote A step-by-step recipe how to create an image

    slide(enter="fadeIn", leave="fadeOut")
      h2 Dockerfile example
      highlight-code.eg-code-block.code-box(lang="dockerfile").
        FROM python:3.7

        WORKDIR /srv

        # install system packages
        RUN apt-get update \
         && apt-get install -y default-libmysqlclient-dev \
         && rm -rf /var/lib/apt/lists/*

        # install python packages
        COPY requirements.txt .
        RUN pip install -r requirements.txt

        # copy rest of the code
        COPY . .

    slide(enter="fadeIn", leave="fadeOut")
      h2 Dockerfile usage
      cinema-player.u-text-centered(id="AfV3PhnWJhePfnftUaI7JXQCU", size="regular")

    slide(enter="fadeIn", leave="fadeOut", steps="3")
      h2 Docker Compose
      eg-transition.u-text-centered(enter='bounceInLeft', leave='fadeOut', v-if="step > 1")
        blockquote Tool for managing multiple containers configuration
      h3(v-if="step > 2") Very useful for development


    slide(enter="fadeIn", leave="fadeOut")
      h2 "Real world" example
      highlight-code.eg-code-block.code-box(v-if="step === 1", lang="yaml").
        # docker-compose.yaml
        version: '2'
        services:
          database:
            image: mysql:5.7
            environment:
              MYSQL_ROOT_PASSWORD: 'secret'

          redis:
            image: redis

          app:
            build: .
            command: python manage.py runserver 0.0.0.0:8000
            volumes:
              - ./src/django:/srv
            environment:
              DJANGO_SETTINGS_MODULE: test.settings.development
            ports:
              - 8000:8000


    slide(enter="fadeIn", leave="fadeOut")
      h2 Demo from one of our projects
      cinema-player.u-text-centered(id="afEYDA72DoFUXeWZA4ZS11K55", size="regular")

    slide(enter="fadeIn", leave="fadeOut", steps="2")
      h2 The best part?
      h1(v-if="step === 2") It's the same for every project!

    slide(enter="fadeIn", leave="fadeOut", steps="2")
      h2 Next steps - production environment benefits
      ul
        li Predictable deployment - exact same environment across multiple servers
        li Ops doesn't have to worry about dependencies, they just "juggle" containers.
        li Lower costs - you can put multiple isolated containers into one server

    slide(enter="fadeIn", leave="fadeOut")
      h2 Comparision vs VM
      .u-text-centered
        img.presentation-image(src="./assets/docker_vs_vm.jpeg")

    slide(enter="fadeIn", leave="fadeOut")
      h2 Thank you!
      h3 Questions?

</template>

<script>
import eagle from 'eagle.js'
import CinemaPlayer from './AsciinemaPlayer'

export default {
  mixins: [ eagle.slideshow ],
  components: {CinemaPlayer},
  data () {
    return {
      shortVersion: true
    }
  }
}
</script>

<style lang='scss'>
  @import url(https://fonts.googleapis.com/css?family=Oxygen);
  #business-logic {
    //background-image: url("~eagle.js/dist/themes/assets/crossword.png");

    &.eg-slideshow::after {
      content: "@jskalc";
      padding-right: 45px;
      padding-top: 3px;
      position: absolute;
      font-size: 0.8em;
      right: 20px;
      bottom: 20px;
      background: url(https://logos-download.com/wp-content/uploads/2016/02/Twitter_logo_bird_transparent_png.png) no-repeat right;
      background-size: contain;
    }

    &.eg-slideshow::before {
      content: "Valian";
      position: absolute;
      padding-left: 45px;
      padding-top: 5px;
      font-size: 0.8em;
      left: 20px;
      bottom: 20px;
      color: #0e3d54;
      background: url(https://image.flaticon.com/icons/svg/25/25231.svg) no-repeat;
      background-size: contain;
    }

    h1, h2, h3, h4, div, blockquote, p, ul, li {
      font-family: "Oxygen", sans-serif;
      color: #184555;
    }

    h1 { font-size: 3.2em; color: #184555; }
    h2 { font-size: 2.1em; }
    h3 { font-size: 1.5em; text-transform: none;}
    h4 { font-size: 1.2em; }
    blockquote {
      font-style: italic;
    }
    ul li {
      margin-bottom: 0.3em;
    }
    .eg-code-block {
      font-size: 0.6em;
    }

    .presentation-image {
      &--solo {
        margin: 15% auto;
      }
    }
  }
  .u-text-centered {
    text-align: center;
  }
</style>
