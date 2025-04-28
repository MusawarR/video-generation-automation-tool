import os
import tempfile
import requests
from moviepy import AudioFileClip, ImageClip, TextClip, VideoFileClip, concatenate_videoclips, CompositeVideoClip

def download_file(url, suffix=""):
    response = requests.get(url)
    response.raise_for_status()
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    tmp.write(response.content)
    
    # FIXME: close may delete the file, try to find an alternative (if there is any)
    tmp.close()
    return tmp.name

def create_scene(audio_url, image_urls, subtitle_text, subtitle_timings=None):
    audio_path = download_file(audio_url, suffix=".mp3")
    audio_clip = AudioFileClip(audio_path)
    total_duration = audio_clip.duration
    duration_per_image = total_duration / len(image_urls)
    
    print(f"Creating scene with {len(image_urls)} images for {total_duration} seconds")
    print(f"Each image will display for {duration_per_image} seconds")

    image_clips = []
    for i, img_url in enumerate(image_urls):
        try:
            img_path = download_file(img_url, suffix=".jpg")
            print(f"Downloaded image {i+1} to {img_path}")
            
            if os.path.getsize(img_path) < 1000:
                print(f"Warning: Image {i+1} seems too small ({os.path.getsize(img_path)} bytes)")
            
            clip = ImageClip(img_path)
            original_size = clip.size
            print(f"Original image size: {original_size}")
            
            clip = clip.resized(height=720)
            print(f"Resized to: {clip.size}")
            
            clip = clip.with_duration(duration_per_image)
            image_clips.append(clip)
        except Exception as e:
            print(f"Error processing image {i+1}: {e}")
            placeholder = TextClip(f"Image {i+1}", fontsize=70, color='white', 
                                size=(1280, 720), bg_color='black').with_duration(duration_per_image)
            image_clips.append(placeholder)

    if not image_clips:
        print("No valid image clips! Creating placeholder")
        slideshow = TextClip("No images available", fontsize=70, color='white',
                            size=(1280, 720), bg_color='black').with_duration(total_duration)
    else:
        print(f"Concatenating {len(image_clips)} clips")
        slideshow = concatenate_videoclips(image_clips, method="compose")
    
    print(f"Slideshow duration: {slideshow.duration}, size: {slideshow.size}")
    
    if subtitle_timings:
        subtitles = []
        for i, timing in enumerate(subtitle_timings):
            start_time, end_time, text = timing
            duration = end_time - start_time
            try:
                sub = TextClip(
                    text=text,
                    font_size=22,
                    color='white',
                    size=(slideshow.size[0], None),
                    method='caption',
                    font='arial-bold.otf'
                )
                sub = sub.with_duration(duration).with_position(('center', 'bottom')).with_start(start_time)
                subtitles.append(sub)
                print(f"Added subtitle {i+1}: {text} ({start_time:.2f}s - {end_time:.2f}s)")
            except Exception as e:
                print(f"Error creating subtitle {i+1}: {e}")
    else:
        phrases = subtitle_text.split('. ')
        phrase_count = len(phrases)
        time_per_phrase = total_duration / phrase_count
        
        subtitles = []
        for i, phrase in enumerate(phrases):
            if not phrase.strip():
                continue
                
            start_time = i * time_per_phrase
            end_time = (i + 1) * time_per_phrase
            phrase_with_period = phrase if phrase.endswith('.') else phrase + '.'
            
            try:
                sub = TextClip(
                    text=phrase_with_period,
                    font_size=22,
                    color='white',
                    size=(slideshow.size[0], None),
                    method='caption',
                    font='arial-bold.otf'
                )
                
                sub = sub.with_duration(time_per_phrase).with_position(('center', 'bottom')).with_start(start_time)
                subtitles.append(sub)
                
                print(f"Added auto-timed subtitle {i+1}: {phrase_with_period} ({start_time:.2f}s - {end_time:.2f}s)")
            except Exception as e:
                print(f"Error creating subtitle {i+1}: {e}")
    
    all_clips = [slideshow] + subtitles
    print(f"Compositing slideshow with {len(subtitles)} subtitle clips")
    
    scene = CompositeVideoClip(all_clips).with_audio(audio_clip)
    return scene


# ------------------------- NOTE: COPY DATA FROM VGAT UI HERE -------------------------
data = {
    "selectedScripts": [
        {
            "id": 0,
            "scriptContent": "Tired of struggling with tire changes? Meet the new SmartJack — designed for quick, effortless lifts in under 60 seconds. Make tire changes something you don't dread.",
        }
    ],
    "subtitleTimings": [
        {
            "scriptId": 0,
            "timings": [
                (0.0, 2.5, "Tired of struggling with tire changes?"),
                (2.5, 6.0, "Meet the new SmartJack — designed for quick, effortless lifts in under 60 seconds."),
                (6.0, 9.0, "Make tire changes something you don't dread."),
            ],
        }
    ],
    "generatedNarrations": [
        {
            "actor": "Paul",
            "scriptId": 0,
            "fileURL": "https://res.cloudinary.com/datrxojqp/video/upload/v1745493898/vgat/lwojdvlsqox0csg9driu.mp3",
        },
        {
            "actor": "Domi",
            "scriptId": 0,
            "fileURL": "https://res.cloudinary.com/datrxojqp/video/upload/v1745493901/vgat/ynubqird4xalh9gf7qfo.mp3",
        },
    ],
    "generatedImages": [
        {
            "taskType": "imageInference",
            "imageUUID": "61225838-04f6-4cd9-bc7a-a09d18de121b",
            "taskUUID": "f2585fae-f9c3-4b38-8672-695851e3aff3",
            "seed": 7437661667847640,
            "imageURL": "https://im.runware.ai/image/ws/2/ii/61225838-04f6-4cd9-bc7a-a09d18de121b.jpg",
            "positivePrompt": "A promotional ad about a new jack tool. realistic product mockup, isolated on clean background, high contrast lighting, branding showcase.",
        },
        {
            "taskType": "imageInference",
            "imageUUID": "ff7f5e7e-754f-4d2f-97b6-902e0610517c",
            "taskUUID": "f2585fae-f9c3-4b38-8672-695851e3aff3",
            "seed": 7437661667847641,
            "imageURL": "https://im.runware.ai/image/ws/2/ii/ff7f5e7e-754f-4d2f-97b6-902e0610517c.jpg",
            "positivePrompt": "A promotional ad about a new jack tool. realistic product mockup, isolated on clean background, high contrast lighting, branding showcase.",
        },
    ],
}

try:
    print("Loading intro and outro...")

    intro = VideoFileClip("intro.mp4")
    outro = VideoFileClip("outro.mp4")
    target_size = intro.size

    for i, narration in enumerate(data['generatedNarrations']):
        print(f"\nProcessing narration {i+1} of {len(data['generatedNarrations'])}...")

        script_id = narration['scriptId']
        subtitle_text = data['selectedScripts'][script_id]['scriptContent']
        image_urls = [img['imageURL'] for img in data['generatedImages']]

        timing_info = next((t['timings'] for t in data['subtitleTimings'] if t['scriptId'] == script_id), None)
        scene = create_scene(narration['fileURL'], image_urls, subtitle_text, timing_info)

        if scene.size != target_size:
            print(f"Resizing scene {i+1} from {scene.size} to {target_size}")

            scene = scene.resized(target_size)

        if outro.size != target_size:
            outro = outro.resized(target_size)

        print("Concatenating intro, scene, and outro...")
        clips = [intro, scene, outro]
        final_video = concatenate_videoclips(clips, method='compose')

        output_filename = f"video_narration_{i+1}.mp4"
        print(f"Writing video file: {output_filename}")

        final_video.write_videofile(output_filename, fps=24, codec='libx264', audio_codec='aac')

        final_video.close()
        scene.close()
        print(f"Video {i+1} done!")

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()

finally:
    try:
        if intro:
            intro.close()
        if outro:
            outro.close()
        print("Done.")
    except Exception as cleanup_error:
        print(f"Error occurred during cleanup: {cleanup_error}")