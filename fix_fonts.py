import re

with open('src/App.jsx', 'r') as f:
    content = f.read()

# For App.jsx homepage and work page, we'll replace the existing text sizes
# The user wants:
# Large -> text-2xl md:text-4xl
# Medium -> text-xl md:text-2xl
# Small -> text-[17px] md:text-[19px]

def replace_large(match):
    # For h1, h2, replacing text-3xl md:text-5xl or text-3xl with text-2xl md:text-4xl
    inner = match.group(2)
    inner = re.sub(r'text-\w+(-\w+)?(\smd:text-\w+(-\w+)?)?(\slg:text-\w+(-\w+)?)?', '', inner)
    inner = ' '.join(inner.split())
    inner += ' text-2xl md:text-4xl'
    return match.group(1) + inner + '"'

def replace_medium(match):
    # For h3, h4, replace with text-xl md:text-2xl
    inner = match.group(2)
    if 'tracking-widest' in inner and 'uppercase' in inner:
        # Keep labels small
        inner = re.sub(r'text-\w+(-\w+)?(\smd:text-\w+(-\w+)?)?', '', inner)
        inner = ' '.join(inner.split())
        inner += ' text-sm md:text-base'
    else:
        inner = re.sub(r'text-\w+(-\w+)?(\smd:text-\w+(-\w+)?)?', '', inner)
        inner = ' '.join(inner.split())
        inner += ' text-xl md:text-2xl'
    return match.group(1) + inner + '"'

def replace_small(match):
    # For p tags
    inner = match.group(2)
    if 'text-xs' in inner or 'text-[10px]' in inner or 'text-[12px]' in inner:
        return match.group(0) # Skip
    inner = re.sub(r'text-\w+(-\w+)?(\smd:text-\w+(-\w+)?)?', '', inner)
    inner = ' '.join(inner.split())
    inner += ' text-[17px] md:text-[19px]'
    return match.group(1) + inner + '"'

# Actually, doing this globally to App.jsx will be extremely intrusive and might break specific UI like forms or tooltips.
# The user specifically said "for the homepage work page everywhere".
# In App.jsx, I should just map the index.css variables!
