import os

css_path = r'c:\Users\Hassan\Desktop\The-electric-plug\styles.css'
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

root_start = css.find(':root {')
root_end = css.find('}', root_start) + 1

new_root = """:root, [data-theme="light"] {
  --primary: #FFB800;
  --primary-dark: #E5A600;
  --primary-light: #FFD060;
  --primary-glow: rgba(255, 184, 0, 0.25);
  
  /* Static Colors (always the same) */
  --static-black: #0A0A0A;
  --static-white: #FFFFFF;
  
  /* Light Mode (Default) */
  --bg-main: #F4F6F8;
  --bg-secondary: #FFFFFF;
  --bg-card: #FFFFFF;
  --border-color: #E5E7EB;
  --hover-color: #F3F4F6;
  --text-main: #111827;
  --text-muted: #6B7280;
  --text-light: #9CA3AF;
  
  --success: #00C851;
  --danger: #FF4444;
  --info: #33B5E5;
  --warning: #FFBB33;
  
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 20px rgba(0,0,0,0.08);
  --shadow-lg: 0 8px 40px rgba(0,0,0,0.12);
  --shadow-glow: 0 4px 20px rgba(255,184,0,0.3);
  
  --transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  --font-main: 'Inter', sans-serif;
  --font-display: 'Outfit', sans-serif;
}

[data-theme="dark"] {
  --bg-main: #0A0A0A;
  --bg-secondary: #111111;
  --bg-card: #1A1A1A;
  --border-color: #2A2A2A;
  --hover-color: #222222;
  --text-main: #FFFFFF;
  --text-muted: #888888;
  --text-light: #555555;
  
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.4);
  --shadow-md: 0 4px 20px rgba(0,0,0,0.5);
  --shadow-lg: 0 8px 40px rgba(0,0,0,0.6);
}"""

css = css[:root_start] + new_root + css[root_end:]

# Update the variable names
css = css.replace('var(--dark-card)', 'var(--bg-card)')
css = css.replace('var(--dark-border)', 'var(--border-color)')
css = css.replace('var(--dark-hover)', 'var(--hover-color)')
css = css.replace('var(--dark)', 'var(--bg-secondary)')
css = css.replace('var(--gray-1)', 'var(--text-muted)')
css = css.replace('var(--gray-2)', 'var(--text-light)')
css = css.replace('var(--off-white)', 'var(--text-main)')

# Text on primary color should be static black
css = css.replace('color: var(--black)', 'color: var(--static-black)')
# Buttons with white text should be static white (like red badges)
css = css.replace('color: var(--white);', 'color: var(--static-white);') 
# Then change the remaining background/black/white references
css = css.replace('var(--black)', 'var(--bg-main)')
css = css.replace('var(--white)', 'var(--text-main)')

# Fix specific elements where the naive replace might break things:
# The body color should be text-main
css = css.replace('color: var(--static-white);\n  overflow-x: hidden;', 'color: var(--text-main);\n  overflow-x: hidden;')
css = css.replace('color: var(--static-white);\n  display: flex;', 'color: var(--text-main);\n  display: flex;')

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css)

print("CSS updated successfully!")
