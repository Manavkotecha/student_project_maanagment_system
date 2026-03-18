from PIL import Image

path = 'public/logo.png'
img = Image.open(path).convert('RGBA')
px = img.load()

# Replace near-black background with transparency
for y in range(img.height):
    for x in range(img.width):
        r,g,b,a = px[x,y]
        # If pixel is dark (near black) and not already transparent
        if a > 0 and r < 60 and g < 60 and b < 60:
            px[x,y] = (r, g, b, 0)

img.save(path)
print('Saved transparent logo.png')
