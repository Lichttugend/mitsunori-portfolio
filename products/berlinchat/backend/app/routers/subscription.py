# TODO: MVP後に実装（Stripe連携）

from fastapi import APIRouter

router = APIRouter()


@router.post("/checkout")
def create_checkout_session():
    raise NotImplementedError("Stripe integration is not yet implemented")


@router.post("/webhook")
def stripe_webhook():
    raise NotImplementedError("Stripe webhook is not yet implemented")
