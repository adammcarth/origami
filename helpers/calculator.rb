def calculate_lesson_price(num_lessons=0, order_cost=0)
  lesson_price = JTask.get("prices.json", 1).lesson_price.to_i

  grand_total = num_lessons * lesson_price
  if num_lessons > 4
    # apply 20% discount
    grand_total = discount(grand_total, 0.2)
  elsif order_cost > 50
    # apply 10% discount
    grand_total = discount(grand_total, 0.1)
  end

  return grand_total
end

def discount(price=0, percentage=0)
  return price - (price * percentage)
end

def gst(total=0)
  return total * 0.1
end