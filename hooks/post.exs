IO.puts("Post hook")

alias Genex.Builder.Render.Utils

assets_folder = Utils.assets_path()

IO.puts("Running command: #{assets_folder}")
# command =
#   "tailwindcss -i #{Path.join([assets_folder, "css", "app.css"])} -o #{Path.join([assets_folder, "css", "output.css"])}"

# IO.puts("Running command: #{command}")

System.cmd("tailwindcss", [
  "-c",
  Path.join([assets_folder, "tailwind.config.js"]),
  "-i",
  Path.join([assets_folder, "css", "app.css"]),
  "-o",
  Path.join([assets_folder, "css", "output.css"])
])
