local depths = {}
local count = 0

for line in io.lines() do
  table.insert(depths, tonumber(line))
end

for i = 1, #depths - 1 do
  local a = depths[i]
  local b = depths[i + 1]

  if b - a > 0 then
    count = count + 1
  end
end

print('Number of increases', count)
