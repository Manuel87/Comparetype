import sublime_plugin
import subprocess
import os
from threading import Thread

def compile(input_file):
    output_file = os.path.splitext(input_file)[0] + ".css"
    cmd = "sass '{0}':'{1}'".format(input_file, output_file)
    subprocess.call(cmd, shell=True)

class SCSS(sublime_plugin.EventListener):

    def on_post_save(self, view):
        scope = (view.syntax_name(view.sel()[0].b)).split().pop()
        if scope == "source.scss":
            input_file = view.file_name()
            t = Thread(target=compile, args=(input_file,))
            t.start()
