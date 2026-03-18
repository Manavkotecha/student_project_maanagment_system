from PIL import Image

# Source logo file (should be transparent, square)
src_path = 'public/logo.png'

# Output paths
ico_path = 'public/favicon.ico'
png_sizes = [192, 256, 512]

# Load source image
img = Image.open(src_path).convert('RGBA')

# Generate PNG sizes
for size in png_sizes:
    out_path = f'public/logo-{size}.png'
    img.resize((size, size), Image.LANCZOS).save(out_path)
    print('Wrote', out_path)

# Generate favicon.ico (multiple sizes)
sizes = [(16, 16), (32, 32), (48, 48), (64, 64)]
imgs = [img.resize(s, Image.LANCZOS) for s in sizes]
imgs[0].save(ico_path, format='ICO', sizes=sizes)
print('Wrote', ico_path)
