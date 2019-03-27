<template>
  <div :id="id" ref="container"></div>
</template>

<script>
  export default {
    props: ['id', 'size'],
    mounted () {
      // Can't use script tags directly apparently
      const asciiscript = document.createElement('script')
      const url = `https://asciinema.org/a/${this.id}.js`
      asciiscript.setAttribute('src', url)
      asciiscript.setAttribute('id', `asciicast-${this.id}`)
      asciiscript.setAttribute('data-size', this.size || 'normal')
      this.$refs.container.appendChild(asciiscript)
    }
  }
</script>

