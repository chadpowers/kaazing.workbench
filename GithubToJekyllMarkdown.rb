# encoding: utf-8

# adds Front Matter and fixes links for converting GitHub markdown docs to Jekyll-ready markdown docs
# finds and applies to all files in current directory and its sub-directory
@fromDir = ARGV[0]

@inline_link       = /(\](\s|)\(\s*)([^\#])(.)*\.[A-Za-z0-9\#_]*\s*\)/
@reference_link    = /(\]\:\s*)(|<)([^\#])(.)*\.[A-Za-z0-9\#_]*(\s|>)/
@invalid_ending    = /(index)*\.(md|markdown|mdown|mkdn)/
@invalid_codeBlock = /``+[ \t\r\f]*\S/

def isIndexFile(file_name)
  return (file_name.include?("/index.md")    \
    or file_name.include?("/index.mkdn")     \
    or file_name.include?("/index.markdown") \
    or file_name.include?("/index.mdown"))
end

def containsStandingURL(s)
  return (s.include?("https://") or s.include?("http://") or s.include?("www."))
end

def beginsWithFrontMatter(text)
  return ((text =~ /\s*---\s*\n/) == 0)
end

def addFrontMatter(text, file_name)
  file_name_copy = file_name + ""
  file_name_copy.slice! @fromDir
  new_contents =  "---\n"
  new_contents << "layout: documentation\n"
  new_contents << "title: "
  new_contents << file_name_copy
  new_contents << "\n---\n\n"
  new_contents << text
end


# Fix links before processing by Jekyll, 
# 1) removes '.md', .'markdown', etc., 
#       from same intra-directory links (solves Jekyll issue)
# 2) adds '../' to intra-directory links (solves Jekyll issue)
def fixLinks(text, file_name)
  
  # resolves links in files ending in index.*
  if isIndexFile(file_name)

    # inline lines w/ format
    text = text.gsub(@inline_link) {|s| if containsStandingURL(s)
      s # do nothing if it is free standing url link (includes http(s):// or www.)
    else 
      s.gsub(@invalid_ending, "")
    end}

    # reference lines w/ format
    text = text.gsub(@reference_link) {|s| if containsStandingURL(s)
      s # do nothing if it is free standing url link (includes http(s):// or www.)
    else 
      s.gsub(@invalid_ending, "")
    end}

  # resolves links in files NOT ending in index.*
  else

    # inline lines w/ format
    text = text.gsub(@inline_link) {|s| if containsStandingURL(s)
      s # do nothing if it is free standing url link (includes http(s):// or www.)
    else 
      s.gsub(@invalid_ending, "").gsub(/\](\s|)\(\s*/, "\]\(\.\.\/")
    end}
    # reference lines w/ format
    text = text.gsub(@reference_link) {|s| if containsStandingURL(s)
      s # do nothing if it is free standing url link (includes http(s):// or www.)
    else 
      temp = s.gsub(@invalid_ending, "").gsub(/\]\:\s*(<|)/, "\]\:\s\.\.\/")
      temp.gsub(/>/, "")
    end}
  end
  return text
end

def fixCodeBlocks(text)
  text = text.gsub(/```+ m *\n/,           "``` objective-c\n")
  text = text.gsub(/```+ auto-links: *\n/, "``` xml\n")
  text = text.gsub(/```+ xml: *\n/,        "``` xml\n")
  text = text.gsub(/```+ txt *\n/,         "``` \n")
  text = text.gsub(/```+ vb(\.?net)? *\n/, "``` vb.net\n")
  text = text.gsub(/```+ cs *\n/,          "``` c\#\n")
  return text
end


file_names  = Dir.glob(@fromDir + "**/*.md")
file_names += Dir.glob(@fromDir + "**/*.mkdn")
file_names += Dir.glob(@fromDir + "**/*.mdown")
file_names += Dir.glob(@fromDir + "**/*.markdown")

file_names.each do |file_name| 
  text = File.read(file_name, :encoding => "UTF-8")

  # adds Front Matter used by Jekyll in conversion to HTML
  # assumes 'layout: documentation'
  #new_contents = text
  if !beginsWithFrontMatter(text)
    new_contents = addFrontMatter(text, file_name)
    #new_contents = fixLinks(new_contents, file_name)
    new_contents = fixCodeBlocks(new_contents)
  else
    new_contents = text
  end

  File.open(file_name, "w") {|file| file.puts new_contents }
end