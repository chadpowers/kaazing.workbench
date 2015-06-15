@fromDir = ARGV[0]
@toDir = ARGV[1]

file_names  = Dir.glob(@fromDir + "**/*.*")



dirRegExp = /#{Regexp.quote(@fromDir)}/
docFileRegExp = /#{Regexp.quote(@fromDir)}.*\/doc\//

doc_file_names = []

def makePathForFile(some_file)
  dirname = File.dirname(some_file)
  tokens = dirname.split(/[\/\\]/) # don't forget the backslash for Windows! And to escape both "\" and "/"

  1.upto(tokens.size) do |n|
    dir = tokens[0...n].join("/")
    Dir.mkdir(dir) unless Dir.exist?(dir)
  end
end

def pathForFile(old_file_name)
  new_file_name = old_file_name + ""
  new_file_name.slice! @fromDir
  new_file_name.gsub(/.*\/doc\//) {|s| directory(s)}
end

def directory(s)
  base = ARGV[1]+ "documentation/5.0/"
  case s
  when "gateway/doc/"
    return base
  when "enterprise.gateway/doc/"
    return base
  when "c.client/doc/"
    return base + "c/"
  when "amqp-websocket-c/doc/"
    return base + "c/"
  when "ios.client/ws/doc/"
    return base + "ios/"
  when "enterprise.ios.client/jms/doc/"
    return base + "ios/"
  when "enterprise.flash.client/amqp/doc/"
    return base + "flash/"
  when "enterprise.flash.client/gateway/doc/"
    return base + "flash/"
  when "enterprise.flash.client/jms/doc/"
    return base + "flash/"
  when "enterprise.dotnet.client/ws/doc/"
    return base + "windows/"
  when "enterprise.dotnet.client/jms/doc/"
    return base + "windows/"
  when "enterprise.gwt.client/doc/"
    return base + "gwt/"
  when "java.client/ws/doc/"
    return base + "java/"
  when "java.client/amqp/doc/"
    return base + "java/"
  when "enterprise.java.client/jms/doc/"
    return base + "java/"
  when "android.client/doc/"
    return base + "java/"
  when "enterprise.android.client/doc/"
    return base + "java/"
  when "javascript.client/gateway/doc/"
    return base + "javascript/"
  when "javascript.client/amqp/doc/"
    return base + "javascript/"
  when "enterprise.javascript.client/jms/doc/"
    return base + "javascript/"
  else
    return base + "ZZZ_ERROR/" + s
  end
end

file_names.each do |file_name| 
  if ((file_name =~ docFileRegExp) == 0)
    doc_file_names += [file_name]
    new_file_name = pathForFile(file_name)
    makePathForFile(new_file_name)
    if (File.file?(new_file_name))
      #puts new_file_name
      #puts file_name
    end
    text = File.read(file_name, :encoding => "UTF-8")
    File.open(new_file_name, "w") {|file| file.puts text }
  end
end

puts ""
#puts doc_file_names
puts "#{doc_file_names.length} of #{file_names.length} fit doc criteria"
#puts file_names.length
puts ""