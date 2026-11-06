# Exact money boundary

Status: accepted bounded technical proposal by Team Lead, based on accepted
product Money quantum clarification at 569a577. No domain integration authorized.

Provide a pure bigint rational quantizer and canonical decimal integer codec.
Q(n/d)=10*floor(n/(10*d)), n>=0,d>0. Preserve quoted amount scale.
No numeric defaults, bank semantics, ledger/turn mutation, catalog or layout.
