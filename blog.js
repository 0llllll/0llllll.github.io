<style>
/* 这里保留你原本的全部 CSS 代码，没有任何修改 */
/* 请把你一开始发给我的那一大串 <style>...</style> 粘贴在这里，我在这里省略以节省版面 */
</style>

<canvas id="shuicheCanvas"></canvas>

<div class="alist-widget-wrapper">
    <!-- 这里保留你原本的所有 HTML 标签节点代码 -->
    <!-- 注意头像部分我做了微小修改如下： -->
    <!-- 
    <div class="profile-header">
        <img src="https://media4.giphy.com/media/AlH6Won01J8wtufqpb/giphy.gif" alt="头像" class="profile-pic" onclick="if(typeof confetti !== 'undefined'){confetti({particleCount:150,spread:100});} window.avatarSoundPlay();" />
    </div>
    -->
    <!-- 其余所有的 HTML 全部照搬原来的 -->
</div>

<!-- ================= 绝对路径引入外部库 ================= -->
<script src="https://cdn.jsdelivr.net/npm/clipboard@2/dist/clipboard.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>

<!-- ================= 引入你存放在云端的 main.js ================= -->
<!-- ⚠️ 重要：把下面的 src 替换成你上传到 Cloudflare R2 / GitHub 的真实链接 -->
<script src="https://pub-xxxxxx.r2.dev/main.js"></script>