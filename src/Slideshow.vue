<template lang='pug'>
.eg-theme-agrume
  #business-logic.eg-slideshow
    slide(enter="fadeIn", leave="fadeOut")
      h1 Business Logic in
      .u-text-centered
        img(src="./assets/django-logo.png")
      h2 Jakub Skałecki @jskalc
      h4.u-text-centered PyKonik, 27.09.2018


    slide(enter="fadeIn", leave="fadeOut")
      h2 Demo
      cinema-player.u-text-centered(id="17648", size="big")

    slide(enter="fadeIn", leave="fadeOut")
      h2 About me
      ul
        li Currently Technical Team Leader at VideoBeat
        li CTO at <a href='https://pvpc.eu'>PvP Center</a>
        li Frontend, Backend, DevOps, GameDev, Machine Learning...
        li Blogger (sometimes)
        li Polyglot programmer, technology enthusiast

    slide(enter="fadeIn", leave="fadeOut", steps="3")
      h2 Business logic
      h3(v-if="step === 2") Your definitions?
      h3(v-if="step > 2") My definition
      eg-transition(enter='bounceInLeft', leave='fadeOut', v-if="step > 2")
        blockquote It's a set of domain-related rules how data in our application can be manipulated, based on real-world requirements.

    slide(enter="fadeIn", leave="fadeOut", steps="3")
      h2 Business logic
      .u-text-centered
        h4(v-if="step === 1") Queries + Commands
        div(v-if="step === 2")
          h4
            strong Queries
            |  + Commands
          eg-transition(enter='bounceInDown', key="queries")
            p
              | In Django, the best place is a good combination of
              strong  Manager
              |  and
              strong  QuerySet
              |  methods
        div(v-if="step === 3")
          h4
            | Queries +
            strong  Commands
          eg-transition(enter='bounceInDown', key="commands")
            p We'll be focusing on this aspect during this presentation

    slide(:steps="shortVersion ? 2 : 4")
      h2 Example from my startup
      eg-transition(enter='slideInLeft', leave='slideOutTop', v-if="step === 2", key="example1")
        div
          h4 Forming a team
          ul
            li As a tournament team leader,
            li I can invite other players to my team
            li Only if they have added required game to their accounts
            li And team is not full
      div(v-if="step === 3 && !shortVersion")
        h4 Finishing match
        ul
          li After receiving tournament match results as a webhook,
          li Match should be marked as finished,
          li Winning team should be progressed to the next match,
          li Losing team should be removed from the tournament,
          li They should be notified of what happened,
          li And next match should start if both teams are ready
      div(v-if="step === 4 && !shortVersion")
        h4 Finishing match (conflict case)
        ul
          li After receiving tournament match results from one of participating teams,
          li And they differ,
          li Match should be marked as in conflict,
          li and moderator should be notified

    slide(enter="fadeIn", leave="fadeOut", steps=5)
      h2 Common requirements
      ul
        li Validate if action can be performed
        li(v-if="step > 1") Present to user / log on a server a reason why it can't
        li(v-if="step > 2") Use logic in different contexts
        li(v-if="step > 3") Heavy testing
        li(v-if="step > 4") Be readable!
      .u-text-centered
        img.presentation-image(v-if="step === 1" src="./assets/join_tournament_allowed.png")
        img.presentation-image(v-if="step === 2" src="./assets/join_tournament_error.png")

    slide(enter="fadeIn", leave="fadeOut", steps="3")
      h2 Django - MVT framework
      h3(v-if="step >= 2") #[strong Model] + #[strong View] + #[strong Template]
      h3(v-if="step >= 3") Where to put business logic?

    slide(enter="fadeIn", leave="fadeOut", steps="5")
      h2 Model + #[strong View] + Template
      h4(v-if="step === 2") Typical choice for new Django users
      highlight-code.eg-code-block.code-box(v-if="step === 3", lang="python").
        def invite_player_to_team(request):
            # simplified
            form = TeamMemberForm(request.POST)
            if form.is_valid():
                member = form.save()
                message = "User has been invited to the team!"
                messages.success(message)
                return HttpResponseRedirect('/team/')
            else:
                return HttpResponse(
                    'template.html',
                    context={'form': form})

      template(v-if="step === 4")
        h4 Pros
        ul
          li Easy & works
          li Well-documented
          li Has many shortcuts in Django, like ModelForm

      template(v-if="step === 5")
        h4 Cons
        ul
          li Hard to reuse (multiple similar views? management commands?)
          li Hard and slow to test (full request - response cycle)

    slide(enter="fadeIn", leave="fadeOut", steps="6")
      h2 #[strong Model] + View + Template
      h4(v-if="step === 2") Typical second choice
      highlight-code.eg-code-block.code-box(v-if="step === 3", lang="python").
        class Team(models.Model):
            ...

            def add_member(user):
                member = TeamMember(user=user, team=self)
                member.save()
                return member

      template(v-if="step === 4")
        h4 Pros
        ul
          li DRY (views just calls methods from models)
          li "Fat models, skinny views"

      template(v-if="step === 5")
        h4 Cons
        ul
          li Business logic is usually cross-model
          li Where to put this function?
          li Models will grow and eat you

      highlight-code.eg-code-block.code-box(v-if="step === 6", lang="python").
        class Team(models.Model):
            ...

            def add_member(user, inviting_member):
                if inviting_member.role != LEADER:
                    raise TeamInvitationException(
                        "You have to be a leader!")
                if not user.has_game(self.game):
                    raise TeamInvitationException(
                        "User don't have this game!")
                member = TeamMember(user=user, team=self)
                member.save()
                notifications.send(user, "You are invited to the team")
                invitation_create_signal.send_robust(member)
                return member

    slide(enter="fadeIn", leave="fadeOut", steps="4")
      h2 Model + View + #[strong Template]
      h4(v-if="step >= 2 && step <= 3") The final solution I wanted to show you
      highlight-code.eg-code-block.code-box(v-if="step === 3").
        {% has_game user team.game as user_has_game %}
        {% is_leader team inviting_member as is_leader %}
        {% if not user_has_game %}
            User has to add this game first!
        {% elif not is_leader %}
            You are not a leader!
        {% else %}
            &lt;Button&gt;Invite!&lt;/Button&gt;
        {% endif %}
      .u-text-centered
        img(v-if="step === 4", src="./assets/rickrolled.gif")

    slide(enter="fadeIn", leave="fadeOut", steps="4")
      h2 My solution
      .u-text-centered
        img(v-if="step === 2" src="./assets/django_raw.svg")
        img(v-if="step === 3" src="./assets/django_clean.svg")
        img(v-if="step === 4" src="./assets/django_services.svg")

    slide(enter="fadeIn", leave="fadeOut", steps="4")
      h2 Services.py
      highlight-code.eg-code-block.code-box(v-if="step === 1", lang="python").
        def invite_user_to_team(user, inviting_member):
            member = TeamMember(user=user, team=self)
            member.save()
            notifications.send(user, "You are invited to the team")
            return member
      div(v-if="step === 2")
        h4 Requirements
        ul
          li Standard python functions
          li Only Django models (no request, responses, forms)
          li Everything needed should be passed by parameters
          li Result dependant only on parameters and DB (semi-functional?)
      div(v-if="step === 3")
        h4 Testing is easy
        highlight-code.eg-code-block.code-box(lang="python").
          @mock.patch('services.notifications')
          def test_invite_to_team(notification_mock):
              team = TeamFactory()
              leader = TeamLeaderFactory(team=team)
              user = UserFactory()
              invited_user = invite_user_to_team(user, leader)
              assert invited_user.team == team
              notification_mock.send.assert_called_with(
                  user, "You are invited to the team")
      div(v-if="step === 4")
        h4 You can use it in different contexts
        ul
          li Views
          li Management commands
          li Async tasks
          li API methods

    slide(enter="fadeIn", leave="fadeOut", steps="2")
      div(v-if="step === 1")
        h2 It can solve
        ul
          li Validate if action can be performed
          li Present to user / log on server a reason why it can't
          li
            strong Use logic in different contexts
          li
            strong Heavy testing
          li
            strong Be readable!
      div(v-if="step === 2")
        h2 But what about these?
        ul
          li
            strong Validate if action can be performed
          li
            strong Present to user / log on server a reason why it can't
          li Use logic in different contexts
          li Heavy testing
          li Be readable!
      
    slide(enter="fadeIn", leave="fadeOut", steps="4")
      h2 Validate an action
      highlight-code.eg-code-block.code-box(v-if="step === 1", lang="python").
        def invite_user_to_team(user, inviting_member):
            if inviting_member.role != LEADER:
                raise BusinessLogicException("You have to be a leader!")
            if not user.has_game(self.game):
                raise BusinessLogicException("User don't have this game!")
            member = TeamMember(user=user, team=self)
            member.save()
            notifications.send(user, "You are invited to the team")
            return member
      highlight-code.eg-code-block.code-box(v-if="step === 2", lang="python").
        def can_invite_user_to_team(user, inviting_member):
            if inviting_member.role != LEADER:
                raise BusinessLogicException("You have to be a leader!")
            if not user.has_game(self.game):
                raise BusinessLogicException("User doesn't have this game!")
        
        def invite_user_to_team(user, inviting_member):
            member = TeamMember(user=user, team=self)
            member.save()
            notifications.send(user, "You are invited to the team")
            return member
      highlight-code.eg-code-block.code-box(v-if="step === 3", lang="python").
        def can_invite_user_to_team(user, inviting_member):
            if inviting_member.role != LEADER:
                raise BusinessLogicException(
                    "You have to be a leader!", error_code='NOT_LEADER')
            if not user.has_game(self.game):
                raise BusinessLogicException(
                    "User doesn't have this game!", error_code='NEED_GAME')
            return True

        def invite_user_to_team(user, inviting_member):
            member = TeamMember(user=user, team=self)
            member.save()
            notifications.send(user, "You are invited to the team")
            return member
      highlight-code.eg-code-block.code-box(v-if="step === 4", lang="python").
        # Usage
        def invite_user_view(request):
            # simplified, can be done using forms or serializers in API
            member = TeamMember.objects.get(user_id=request.user.pk)
            user = User.objects.get(pk=request.POST.get('user_pk'))
            try:
                if can_invite_user_to_team(user, member):
                    member = invite_user_to_team(user, member)
                    return HttpResponseRedirect('/team/')
            except BusinessLogicException as e:
                # template can use error message or error code
                return HttpResponse(template, context={'error': e})

    slide(enter="fadeIn", leave="fadeOut", steps="3")
      h2 Can we do better?
      h3(v-if="step === 2") Sure!
      h4(v-if="step === 3") Let's look into my #[strong python-business-logic] package

    slide(enter="fadeIn", leave="fadeOut", steps="6")
      h2 python-business-logic
      highlight-code.eg-code-block.code-box(v-if="step === 1", lang="python").
        from business_logic import validator, validated_by, LogicException

        @validator
        def can_invite_user_to_team(user, inviting_member):
            if inviting_member.role != LEADER:
                raise LogicException(
                    "You have to be a leader!", error_code='NOT_LEADER')
            ...

        @validated_by(can_invite_user_to_team)
        def invite_user_to_team(user, inviting_member):
            ...
      highlight-code.eg-code-block.code-box(v-if="step === 2", lang="python").
        # automatic validation and exception raising
        invite_user_to_team(user, inviting_member)

        # skip validation
        invite_user_to_team(user, inviting_member, validate=False)
      highlight-code.eg-code-block.code-box(v-if="step === 3", lang="python").
        # check if action can be performed
        result = can_invite_user_to_team(
            user, inviting_member,
            raise_exception=False)

        if result:
            print("Sure, you can invite him!")
        else:
            assert result.error_code == 'NOT_LEADER'
            # original exception raised, with all details
            assert result.error
      div(v-if="step === 4")
        p Errors registry
        highlight-code.eg-code-block.code-box( lang="python").
          from business_logic import LogicErrors

          class TeamLogicErrors(LogicErrors):
              # automatic error codes
              NOT_LEADER = LogicException("You are not a team leader!")
              NEED_GAME = LogicException("User doesn't have this game!")

        p Usage
        highlight-code.eg-code-block.code-box(lang="python").
          @validator
          def can_invite_user_to_team(user, inviting_member):
            if inviting_member.role != LEADER:
                raise TeamLogicErrors.NOT_LEADER
      div(v-if="step === 5")
        p Validators chaining
        highlight-code.eg-code-block.code-box(lang="python").
          @validator
          def can_take_part_in_tournament(user, tournament):
              if tournament.members.filter(user_pk=user.pk).exists()
                  raise TournamentErrors.ALREADY_IN_TOURNAMENT


          @validator
          def can_invite_user_to_team(user, inviting_member):
              ...
              tournament = inviting_member.team.tournament
              can_take_part_in_tournament(user, tournament)
      highlight-code.eg-code-block.code-box(v-if="step === 6", lang="python").
        # Customized error messages
        class TeamLogicErrors(LogicErrors):
            NEED_GAME = LogicException("{user} doesn't have this game!")

        raise TeamLogicErrors.NEED_GAME.format(user='John')

    slide(enter="fadeIn", leave="fadeOut", steps="2")
      h2 Want better? #[strong Middleware]!
      h4(v-if="step === 1") It allows you to handle exceptions transparently, and code only happy path
      highlight-code.eg-code-block.code-box(v-if="step === 2", lang="python").
        def handle_api_exception(exception, context):
            if isinstance(exception, LogicException):
                # ParseError from Django Rest Framework
                exception = ParseError(f"Invalid operation: {exception}")
            return default_exception_handler(exception, context)

    slide(enter="fadeIn", leave="fadeOut", steps="4")
      h2 Full example from pvpc.eu
      highlight-code.eg-code-block.code-box(v-if="step === 1", lang="python").
        @validator
        def can_invite_user_to_team(by_member, user=None):
            if not by_member.privileged:
                raise TournamentErrorCodes.NOT_TEAM_CREATOR
            if by_member.team.full:
                raise TournamentErrorCodes.TEAM_FULL
            if by_member.team.type == TournamentTeam.FREE_AGENT:
                raise TournamentErrorCodes.CANT_INVITE_TO_FREE_AGENT_TEAM
            if user:
                can_join_tournament_team(user, by_member.team)
            can_modify_team_members(by_member.team)

      highlight-code.eg-code-block.code-box(v-if="step === 2", lang="python").
        @validated_by(can_invite_user_to_team)
        def invite_user_to_team(by_member, user):
          notification_code = 'tournament.team.invitation.received'
          notify(notification_code, user, by_member.team, by_member.user)
          logger.info("User has been invited to the tournament team")
          return TournamentTeamMember.objects.create(
              user=user, team=by_member.team)

      highlight-code.eg-code-block.code-box(v-if="step === 3", lang="python").
        class TournamentTeamMemberSerializer(serializers.ModelSerializer):
            class Meta:
                model = models.TournamentTeamMember
                fields = ('pk', 'user', 'team')

            def create(self, validated_data):
                current_user = self.context['request'].user
                by_member = (
                    models.TournamentTeamMember.objects
                    .filter(user=current_user, team=validated_data['team'])
                    .first())
                if not by_member:
                    raise NotPermittedException("Must be a team member!")
                return services.invite_user_to_team(
                    by_member, user=validated_data['user'])

      highlight-code.eg-code-block.code-box(v-if="step === 4", lang="python").
        def test_cannot_invite_user_to_team_if_free_agent(self):
            user = UserFactory()
            member = TournamentTeamCreatorFactory(
                team__type=TournamentTeam.FREE_AGENT)
            expected = TournamentErrorCodes.CANT_INVITE_TO_FREE_AGENT_TEAM
            with self.shouldRaiseException(expected):
                services.can_invite_user_to_team(member, user)


    slide(enter="fadeIn", leave="fadeOut")
      h2 Questions?
      div.u-text-centered
        h4 <a href='https://github.com/Valian/python-business-logic'>github.com/Valian/python-business-logic</a>
        h4 Twitter @jskalc
        h4 LinkedIn <a href="https://www.linkedin.com/in/jskalec/">Jakub Skałecki</a>
        h4 Blog <a href="https://rock-it.pl">rock-it.pl</a>


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
      color: #0e553d;
    }

    h1 { font-size: 3.2em; color: #0C3C26; }
    h2 { font-size: 2.1em; }
    h3 { font-size: 1.5em; }
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
  }
  .u-text-centered {
    text-align: center;
  }
</style>
