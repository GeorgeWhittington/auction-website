from datetime import datetime
from shop.models import Item, Set, Order
from django.core.mail import EmailMultiAlternatives
from django.contrib.auth.models import User
from api.validate import Validation, ValidationStatus, validate_checkout_items, validate_checkout_sets

def send_order_email(order):
    subject, from_email, to = f'Your order has been placed #{order.number}', 'jamhouse.noreply@gmail.com', order.user.email

    html_content = f''' <h3>Order #{order.number}</h3>
                        <p>Hello {order.user.first_name}, this email is confirmation that your order has been placed.</p>
                    '''
    if order.items.count() > 0:
        html_content += "<table>"
        html_content += '<tr><th>Item</th><th>Price</th></tr>'
        for item in order.items.all():
            html_content += f'<tr><td>{item.description}</td><td>£{item.price}</td></tr>'
        html_content += '</table>'
    
    if order.sets.count() > 0:
        html_content += "<table>"
        html_content += '<tr><th>Set</th><th>Price</th></tr>'
        for set in order.sets.all():
            html_content += f'<tr><td>{set.description}</td><td>£{set.price}</td></tr>'
        html_content += '</table>'
    
    msg = EmailMultiAlternatives(subject, "", from_email, [to])
    msg.attach_alternative(html_content, "text/html")
    msg.send()

def buy_item(item: Item):
    item.sold_at = datetime.now()
    item.save()

def buy(item_ids: list, set_ids: list, user: User) -> bool:

    # validate items
    validation = validate_checkout_items(item_ids)
    if validation.status != ValidationStatus.SUCCESS:
        return validation
    
    # validate sets
    validation = validate_checkout_sets(set_ids)
    if validation.status != ValidationStatus.SUCCESS:
        return validation
    
    # Mark each item as sold
    item_qs = Item.objects.filter(id__in=item_ids, sold_at__isnull=True)
    set_qs = Set.objects.filter(id__in=set_ids)
    set_item_qs = Item.objects.filter(sets__in=set_ids, sold_at__isnull=True)
    
    order = Order()
    order.save()
    order.user = user
    
    for i in item_qs:
        buy_item(i)
        order.items.add(i)
        
    for i in set_item_qs:
        buy_item(i)

    for s in set_qs:
        order.sets.add(s)

    order.save()

    # Send a cheeky email
    send_order_email(order)

    return Validation(ValidationStatus.SUCCESS)