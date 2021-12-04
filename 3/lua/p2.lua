local function filter(t, f)
  local nt = {}

  for _,v in pairs(t) do
    if f(v) then table.insert(nt, v) end
  end

  return nt
end

local function prune(bins, pos, tb)
  local count = 0
  local ch = ''

  for _,n in ipairs(bins) do
    if n:sub(pos, pos) == '1' then
      count = count + 1
    else
      count = count - 1
    end
  end

  if tb == 1 then
    if count >= 0 then
      ch = '1'
    else
      ch = '0'
    end
  else
    if count >= 0 then
      ch = '0'
    else
      ch = '1'
    end
  end

  local filtered = filter(bins, function (n)
    return n:sub(pos, pos) == ch
  end)

  if #filtered == 1 then
    return filtered[1]
  else
    return prune(filtered, pos + 1, tb)
  end
end

local binaries = {}

for line in io.lines() do
  table.insert(binaries, line)
end

local oxygen = prune(binaries, 1, 1)
local co2 = prune(binaries, 1, 0)

print(oxygen, tonumber(oxygen, 2))
print(co2, tonumber(co2, 2))
print(tonumber(oxygen, 2) * tonumber(co2, 2))
