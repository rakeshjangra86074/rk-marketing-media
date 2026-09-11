VIDEO_SECTION = '''
    <!-- SCROLL VIDEO SHOWCASE — Digital Marketing Videos -->
    <section class="section scroll-video-showcase" id="videoShowcase">
      <div class="container">
        <div class="svs-header section-header text-center">
          <span class="section-tag">DIGITAL MARKETING IN ACTION</span>
          <h2 class="section-title">Watch How We <span class="gradient-text">Drive Results</span></h2>
          <p class="section-description">
            Scroll through each chapter below to see the core strategies powering modern brand growth &mdash; from viral reels to high-ROAS ad campaigns.
          </p>
        </div>

        <div class="svs-layout">
          <!-- Sticky Video Player -->
          <div class="svs-video-pane">
            <div class="svs-video-wrap">
              <video class="svs-video-el" autoplay muted loop playsinline preload="metadata">
                <source src="https://videos.pexels.com/video-files/3196165/3196165-sd_960_506_25fps.mp4" type="video/mp4">
              </video>
              <div class="svs-video-badge">
                <span class="pulse-dot"></span>
                RK Growth Engine
              </div>
            </div>
            <div class="svs-video-caption">
              <p class="svs-caption-title">Viral Short-Form Content</p>
              <p class="svs-caption-desc">Stop-the-scroll reels engineered for 3-second hook retention</p>
            </div>
          </div>

          <!-- Scrollable Chapters -->
          <div class="svs-chapters">
            <div class="svs-chapter svs-active"
              data-video-src="https://videos.pexels.com/video-files/3196165/3196165-sd_960_506_25fps.mp4"
              data-cap-title="Viral Short-Form Content"
              data-cap-desc="Stop-the-scroll reels engineered for 3-second hook retention">
              <div class="svs-chapter-progress"></div>
              <span class="svs-chapter-num">Chapter 01 &bull; Viral Reels</span>
              <h3 class="svs-chapter-title">Engineered to Stop the Scroll</h3>
              <p class="svs-chapter-body">We produce kinetic, hook-driven vertical content that captures attention within the first 3 seconds &mdash; achieving 80%+ average hold rates across Instagram, YouTube Shorts, and Facebook Reels.</p>
            </div>

            <div class="svs-chapter"
              data-video-src="https://videos.pexels.com/video-files/6476783/6476783-sd_960_506_25fps.mp4"
              data-cap-title="Algorithmic Media Buying"
              data-cap-desc="Meta and Google Ads with CAPI tracking, multi-variant creative tests">
              <div class="svs-chapter-progress"></div>
              <span class="svs-chapter-num">Chapter 02 &bull; Paid Media</span>
              <h3 class="svs-chapter-title">Multi-Variable Ad Testing on Meta &amp; Google</h3>
              <p class="svs-chapter-body">We deploy Conversions API, audience exclusion matrices, and 15+ creative variants weekly &mdash; locking in compounding ROAS improvements that scale without fatigue.</p>
            </div>

            <div class="svs-chapter"
              data-video-src="https://videos.pexels.com/video-files/3015518/3015518-sd_960_540_30fps.mp4"
              data-cap-title="Brand Authority and Creator Engine"
              data-cap-desc="Founder storytelling and organic compounding to dominate your niche">
              <div class="svs-chapter-progress"></div>
              <span class="svs-chapter-num">Chapter 03 &bull; Brand Authority</span>
              <h3 class="svs-chapter-title">Positioning Founders as Category Leaders</h3>
              <p class="svs-chapter-body">Through executive scripting, thought leadership reels, and algorithmic distribution, we turn your brand presence into an inbound lead machine that compounds over time.</p>
            </div>

            <div class="svs-chapter"
              data-video-src="https://videos.pexels.com/video-files/7579956/7579956-sd_960_506_25fps.mp4"
              data-cap-title="Funnels and Conversion Optimisation"
              data-cap-desc="Mobile-first landing pages and CRO sprints driving measurable sales">
              <div class="svs-chapter-progress"></div>
              <span class="svs-chapter-num">Chapter 04 &bull; Funnels &amp; CRO</span>
              <h3 class="svs-chapter-title">Frictionless Funnels Built to Convert</h3>
              <p class="svs-chapter-body">Sub-second mobile landing pages with persuasive copy, 1-click WhatsApp lead capture, and ongoing A/B CRO sprints that continuously drive down your cost per acquisition.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
'''

files = ['about.html', 'services.html', 'portfolio.html', 'insights.html', 'contact.html']

for fname in files:
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()

    # Insert before </main> if present
    if '</main>' in content:
        content = content.replace('</main>', VIDEO_SECTION + '\n  </main>', 1)
        print(f'{fname}: inserted before </main>')
    else:
        # Insert before the audit modal
        insert_before = '  <!-- Free Growth Audit Modal'
        if insert_before in content:
            content = content.replace(insert_before, VIDEO_SECTION + '\n\n  <!-- Free Growth Audit Modal', 1)
            print(f'{fname}: inserted before audit modal')
        else:
            print(f'{fname}: WARNING - no insertion point found!')

    # Bump versions
    content = content.replace('styles.css?v=4.1', 'styles.css?v=4.2')
    content = content.replace('script.js?v=4.1', 'script.js?v=4.2')

    with open(fname, 'w', encoding='utf-8') as f:
        f.write(content)

print('Done.')
