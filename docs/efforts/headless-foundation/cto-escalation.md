# Team Lead -> CTO: turn-boundary disposition requested

Effort EFF-headless-foundation revision 1; proposal
5da5697afdb26f72e5d26873cc1ea623ea89d919. Status: pending CTO disposition.

## Facts and blocked work

Accepted rules specify 45 seconds, a forced roll followed by 20 seconds in the
same turn with retained quotas, fresh doubles turns and immediate prison on
third doubles. They do not explicitly select equality/late-command precedence
or the interaction between forced doubles and continuation. Design section
Turns and unresolved semantic gate and OpenSpec T06/T07 show exact examples.
These block turns Apply only; kernel/setup and design review may continue.

## Options and recommendation

1. Recommend player commands accepted only at nowMs < deadline and Timeout at
nowMs >= deadline. Late player command rejects without implicitly running a
timeout. Both command revision and target turn ID prevent old timers affecting
new turns. Alternative player priority at equality changes the winning input
at that instant; implicit timeout on late input changes command effects.
2. Recommend first/second forced doubles retain the same turn and quotas for
20 seconds, then grant a fresh doubles turn upon completion. Third doubles
enters prison immediately before movement/reward and ends turn. Alternative
immediate bonus turn removes the promised continuation on a forced double.

Please interpret within CTO authority or escalate only the reserved ambiguity
to User. Record the decision in canonical product/spec sources before turns
Apply. No product semantic decision is implied by this recommendation.

Delivery prerequisite also pending: no remote or CI/protection configuration
exists. CTO should supply an already authorized host/access path when available;
no new external commitment or provisioning is requested from Engineers.
