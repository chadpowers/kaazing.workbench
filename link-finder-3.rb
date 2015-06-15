# encoding: utf-8

# adds Front Matter and fixes links for converting GitHub markdown docs to Jekyll-ready markdown docs
# finds and applies to all files in current directory and its sub-directory
@fromDir = ARGV[0]

# regex for link fixing
@inline_link       = /\] ?\( *[^\[\(\)\]]* *\)/
@reference_link    = /(\[[^\[\]]*\]\: *)<?([^\[\)\]\(\s])+( *>)?/
@invalid_ending    = /(\/index)?\.(md|markdown|mdown|mkdn)/

# global counters
@n = 0
@doc_links = 0
@ext_links = 0
@total_inline = 0
@total_reference = 0

# debug printing
@debug_findNonUniqueFileName   = false
@debug_printAllLinksWithFile   = false
@debug_printAllLinksComponents = false
@debug_printLinkStats          = true
@debug_printLinksOldAndNew     = false

# debuging messages
@debug_h = ""



def isIndexFile(file_name)
  return (file_name.include?("/index.md")    \
    or file_name.include?("/index.mkdn")     \
    or file_name.include?("/index.markdown") \
    or file_name.include?("/index.mdown"))
end

def isAbsoluteURL(s)
  return (s.include?("https://") \
    or s.include?("http://")     \
    or s.include?("www.")        \
    or s.include?("ws://"))
end

def searchFilesForMatch(file, file_names)
  file = "/" + file
  numMatches = 0
  hasMatch = false
  file_match = nil
  file_names.each do |file_name| 
    if file_name.include?(file)
      numMatches += 1
      hasMatch = true
      file_match = file_name if file_match.nil?
    end
  end
  if numMatches > 1
    puts "TOO MANY MATCHES" + file  if @debug_findNonUniqueFileName
  end
  return file_match
end

def genRelLink(from_file_name, target_file_name)
  ## same name link
  return "" if from_file_name == target_file_name

  from_path = from_file_name.split(/[\/\\]/)
  target_path = target_file_name.split(/[\/\\]/)

  # remove common path
  while (from_path[0] == target_path[0])
    from_path.shift
    target_path.shift
  end

  # move up to shared directory and down to correct file
  relLink = ""
  from_path.each do |s|
    relLink << "../"
  end
  target_path.each do |dir|
    relLink << dir + "/" 
  end

  # remove .md and fix directory if its an index.md
  relLink = relLink.gsub(@invalid_ending, "")
  if isIndexFile(from_file_name)
    # remove the first ../
    relLink = relLink[3..-1]
  end

  
  return relLink
end

def getFinalLink(raw_link, file_name)
  if isAbsoluteURL(raw_link)
    if (raw_link.include?("github.com/kaazing/") and raw_link.include?("/doc/"))
      @doc_links += 1

      file = raw_link.gsub(/.*\/doc\//, "")
      target_file_name = searchFilesForMatch(file, @all_file_names)
        
      if !target_file_name.nil?
        @debug_h = "MATCH"
        final_raw_link = genRelLink(file_name, target_file_name)
      else
        @debug_h = "NO MATCH " + file
        final_raw_link = raw_link
      end
    else
      @ext_links += 1
      final_raw_link = raw_link
    end
  elsif raw_link.length > 0
    @doc_links += 1
    file = raw_link.gsub(/\.\.\//, "")
    file = file.gsub(/.*\/doc\//, "")
    target_file_name = searchFilesForMatch(file, @all_file_names)
      
    if !target_file_name.nil?
      @debug_h = "MATCH"
      final_raw_link = genRelLink(file_name, target_file_name)
    else
      @debug_h = "NO MATCH "
      final_raw_link = raw_link
    end
  else
    @doc_links += 1
    final_raw_link = ""
  end
  return final_raw_link
end

# Fix links before processing by Jekyll, 
def fixLinks(text, file_name)

  # fix inline-style links
  text = text.gsub(@inline_link) {|s|
    # counters
    @n = @n + 1
    @total_inline = @total_inline + 1

    # extract and store link title and anchor
    link_title = "" # ... "Link Title"
    anchor_tag = "" # link#anchor_tag

    raw_link = s.gsub(/\"[^\"]*\"/) {|lt|
      link_title = " " + lt
      ""
    }
    raw_link = raw_link.gsub(/(\#[\w-]+)? *\)/) {|at|
      anchor_tag = at
      ""
    }
    # cut excess padding
    raw_link = raw_link.gsub(/(\] ?\(\s*)/, "")

    # repackage link, final is returned
    final = "](" + getFinalLink(raw_link, file_name) + anchor_tag
    final = final.gsub(/\)/, link_title + ")")

    
    # for debuging
    raw_link_print = ("%-70.70s" % raw_link)
    link_title_print = ("%-20.20s" % link_title)
    anchor_tag_print = ("%-40.40s" % anchor_tag)
    puts "#{@n} \t" + raw_link_print + "\t at: \t" +  anchor_tag_print + \
      "\t lt: \t" + link_title_print + @debug_h if @debug_printAllLinksComponents

    puts "#{@n} \t" + raw_link_print + "\t in \t" + \
      file_name if @debug_printAllLinksWithFile

    if @debug_printLinksOldAndNew
      puts s
      puts final
    end

    
    final
  }
  text = text.gsub(@reference_link) {|s|
    @n += 1
    @total_reference += 1

    # extract and store link name, title and anchor
    link_name  = "" # [Link Name]
    link_title = "" # ... "Link Title"
    anchor_tag = "" # link#anchor_tag

    raw_link = s.gsub(/(\[[^\[\]]*\]\: *)/) { |ln|
      link_name = ln
      ""}
    raw_link = raw_link.gsub(/\"[^\"]*\"/) {|lt|
      link_title = " " + lt
      ""
    }
    raw_link = raw_link.gsub(/\#[\w-]+/) {|at|
      anchor_tag = at
      ""
    }
    # cut excess padding
    raw_link = raw_link.gsub(/(<| *>)/, "")

    # repackage link
    final = link_name + getFinalLink(raw_link, file_name) + anchor_tag
    final << link_title

    #return
    final
  }
  return text
end

@md_file_names  = Dir.glob(@fromDir + "**/*.md")
@md_file_names += Dir.glob(@fromDir + "**/*.mkdn")
@md_file_names += Dir.glob(@fromDir + "**/*.mdown")
@md_file_names += Dir.glob(@fromDir + "**/*.markdown")

@all_file_names  = Dir.glob(@fromDir + "**/*.*")


@md_file_names.each do |file_name| 
  text = File.read(file_name, :encoding => "UTF-8")

  # adds Front Matter used by Jekyll in conversion to HTML
  # assumes 'layout: documentation'
  #new_contents = text
  new_text = fixLinks(text, file_name)
  File.open(file_name, "w") {|file| file.puts new_text }
end

if @debug_printLinkStats
  puts ""
  puts "#{@md_file_names.length} \t total markdown documents"
  puts "#{@total_inline} \t total inline links"
  puts "#{@total_reference} \t total reference links"
  puts "#{@doc_links} \t total doc links"
  puts "#{@ext_links} \t total ext links"
  puts ""
end

