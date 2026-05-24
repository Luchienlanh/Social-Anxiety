from bs4 import BeautifulSoup
with open('FE/html/result.html', 'r', encoding='utf-8') as f:
    soup_result = BeautifulSoup(f, 'html.parser')
    
# Extract result sections from result.html
main_result = soup_result.find('main')
result_html_parts = []
for child in main_result.find_all('div', recursive=False):
    if child.get('class') and 'grid' in child.get('class'):
        result_html_parts.append(str(child))
for child in main_result.find_all('section', recursive=False):
    result_html_parts.append(str(child))

# Wrap in a new section
result_html = f'''<section id="resultSection" class="hidden mt-16 pt-16 border-t border-outline-variant/20">
{''.join(result_html_parts)}
</section>
'''

with open('FE/html/test.html', 'r', encoding='utf-8') as f:
    test_content = f.read()

# Insert before </main>
test_content = test_content.replace('</main>', f'{result_html}\n</main>')

with open('FE/html/test.html', 'w', encoding='utf-8') as f:
    f.write(test_content)
