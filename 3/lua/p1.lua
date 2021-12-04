local counts = {}
local gamma, epsilon = '', ''

for line in io.lines() do
  for i = 1, #line do
    local n = line:sub(i, i)

    if counts[i] == nil then counts[i] = 0 end

    if n == '1' then
      counts[i] = counts[i] + 1
    elseif n == '0' then
      counts[i] = counts[i] - 1
    else
      error('Unknown character: '..n)
    end
  end
end

for _,v in ipairs(counts) do
  if v > 0 then
    gamma = gamma .. '1'
    epsilon = epsilon .. '0'
  else
    gamma = gamma .. '0'
    epsilon = epsilon .. '1'
  end
end

print(gamma, tonumber(gamma, 2))
print(epsilon, tonumber(epsilon, 2))
print(tonumber(gamma, 2) * tonumber(epsilon, 2))
