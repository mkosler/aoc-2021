local depths = {}
local count = 0

for line in io.lines() do
  table.insert(depths, tonumber(line))
end

for i = 1, #depths - 3 do
  local a = depths[i] + depths[i + 1] + depths[i + 2]
  local b = depths[i + 1] + depths[i + 2] + depths[i + 3]

  if b - a > 0 then
    count = count + 1
  end
end

print('Number of increases', count)
