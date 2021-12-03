local position = {
  horizontal = 0,
  depth = 0
}

for line in io.lines() do
  local direction, power = line:match('(%a+)%s+(%d+)')
  power = tonumber(power)

  if direction == 'forward' then
    position.horizontal = position.horizontal + power
  elseif direction == 'up' then
    position.depth = position.depth - power
  elseif direction == 'down' then
    position.depth = position.depth + power
  end
end

print(position.horizontal, position.depth, position.horizontal * position.depth)
