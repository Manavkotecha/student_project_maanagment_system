from PIL import Image

path = 'public/logo.png'
img = Image.open(path).convert("RGBA")
bbox = img.getbbox()
if bbox:
    cropped = img.crop(bbox)
    cropped.save(path)
    print("Cropped logo.png successfully to", cropped.size)
else:
    print("Could not find bounding box (completely transparent?)")
