local position = {
  horizontal = 0,
  depth = 0,
  aim = 0
}

for line in io.lines() do
  local direction, power = line:match('(%a+)%s+(%d+)')
  power = tonumber(power)

  if direction == 'forward' then
    position.horizontal = position.horizontal + power
    position.depth = position.depth + (position.aim * power)
  elseif direction == 'up' then
    position.aim = position.aim - power
  elseif direction == 'down' then
    position.aim = position.aim + power
  end
end

print(position.horizontal, position.depth, position.horizontal * position.depth)
