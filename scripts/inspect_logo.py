from PIL import Image

path = 'public/logo.png'
img = Image.open(path)
print('mode', img.mode, 'size', img.size)
print('has alpha', 'A' in img.getbands())
